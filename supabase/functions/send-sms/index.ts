import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { receiver, msg, name } = await req.json()

    const ALIGO_API_KEY = Deno.env.get('ALIGO_API_KEY')
    const ALIGO_USER_ID = Deno.env.get('ALIGO_USER_ID')
    const ALIGO_SENDER = Deno.env.get('ALIGO_SENDER')

    if (!ALIGO_API_KEY || !ALIGO_USER_ID || !ALIGO_SENDER) {
      throw new Error('SMS configuration missing')
    }

    const formData = new FormData()
    formData.append('key', ALIGO_API_KEY)
    formData.append('userid', ALIGO_USER_ID)
    formData.append('sender', ALIGO_SENDER)
    formData.append('receiver', receiver)
    formData.append('msg', msg)
    formData.append('destination', `${receiver}|${name}`)
    formData.append('msg_type', 'SMS')

    const response = await fetch('https://apis.aligo.in/send/', {
      method: 'POST',
      body: formData,
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
