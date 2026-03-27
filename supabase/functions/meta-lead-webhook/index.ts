import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const META_ACCESS_TOKEN = Deno.env.get('META_ACCESS_TOKEN')!
const META_VERIFY_TOKEN = Deno.env.get('META_VERIFY_TOKEN')!

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

serve(async (req) => {
  const url = new URL(req.url)
  const method = req.method

  // 1. Meta Webhook 검증 (GET)
  if (method === 'GET') {
    const mode = url.searchParams.get('hub.mode')
    const token = url.searchParams.get('hub.verify_token')
    const challenge = url.searchParams.get('hub.challenge')
    
    if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
      return new Response(challenge, { 
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      })
    }
    return new Response('Forbidden', { status: 403 })
  }

  // 2. 리드 데이터 수신 (POST)
  if (method === 'POST') {
    try {
      const body = await req.json()
      console.log("Received Webhook Body:", JSON.stringify(body)) // 로그 확인용

      // Meta Lead Ads 데이터 구조 확인
      const changes = body.entry?.[0]?.changes?.[0]
      const leadId = changes?.value?.leadgen_id

      if (!leadId) {
        return new Response(JSON.stringify({ error: 'No leadgen_id found' }), { status: 400 })
      }

      // 3. Meta Graph API 호출
      const response = await fetch(`https://graph.facebook.com/v20.0/${leadId}?access_token=${META_ACCESS_TOKEN}`)
      const leadData = await response.json()

      // 에러 처리 개선: 500 대신 400으로 반환하여 함수가 죽지 않게 함
      if (leadData.error) {
        console.error("Meta API Error:", leadData.error)
        return new Response(JSON.stringify({ 
          error: 'Meta API Error', 
          details: leadData.error.message 
        }), { status: 400 }) 
      }

      // 4. Supabase 저장
      const { error } = await supabase
        .from('leads')
        .insert([{
          name: leadData.field_data?.find((f: any) => f.name === 'full_name')?.values[0] || 'Unknown',
          email: leadData.field_data?.find((f: any) => f.name === 'email')?.values[0] || '',
          phone: leadData.field_data?.find((f: any) => f.name === 'phone_number')?.values[0] || '',
          source: 'Meta Lead Ads',
          status: 'new'
        }])

      if (error) {
        console.error("Supabase Insert Error:", error)
        return new Response(JSON.stringify(error), { status: 500 })
      }

      return new Response(JSON.stringify({ message: 'Success' }), { status: 200 })
    } catch (e) {
      console.error("Function Error:", e)
      return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 })
    }
  }

  return new Response('Method not allowed', { status: 405 })
})
