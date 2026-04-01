import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, cache-control, pragma, expires',
}

async function getSignature(apiSecret: string, date: string, salt: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(apiSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(date + salt)
  );
  return Array.from(new Uint8Array(signature))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { receiver, msg, name } = await req.json()

    // 환경변수에서 가져오거나, 하드코딩된 값 사용
    const SOLAPI_API_KEY = Deno.env.get('SOLAPI_API_KEY') || 'NCSWGLBM2BEQKC0K';
    const SOLAPI_API_SECRET = Deno.env.get('SOLAPI_API_SECRET') || 'C8CJLRONCCICF1YUMYHHXUWBKWWRSRDA';
    const SOLAPI_SENDER = Deno.env.get('SOLAPI_SENDER'); // 발신번호는 반드시 환경변수로 설정 필요

    if (!SOLAPI_SENDER) {
      throw new Error('발신번호(SOLAPI_SENDER)가 설정되지 않았습니다. Supabase 환경변수를 확인해주세요.')
    }

    const date = new Date().toISOString()
    const salt = crypto.randomUUID().replace(/-/g, '')
    const signature = await getSignature(SOLAPI_API_SECRET, date, salt)

    const authHeader = `HMAC-SHA256 apiKey=${SOLAPI_API_KEY}, date=${date}, salt=${salt}, signature=${signature}`

    const response = await fetch('https://api.solapi.com/messages/v4/send', {
      method: 'POST',
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: {
          to: receiver.replace(/[^0-9]/g, ''),
          from: SOLAPI_SENDER.replace(/[^0-9]/g, ''),
          text: msg
        }
      })
    })

    const data = await response.json()

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    )
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 },
    )
  }
})
