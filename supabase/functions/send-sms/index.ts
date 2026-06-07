import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const AT_KEY      = Deno.env.get('AT_API_KEY')      || 'atsk_159f0f8d809b2ac85533bda3112889071384a5819ae57edce36858248d4df41499cdaa73'
const AT_USERNAME = Deno.env.get('AT_USERNAME')      || 'sandbox'
const AT_SENDER   = Deno.env.get('AT_SENDER_ID')     || 'FindMyChop'

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: cors })

  try {
    const { phone, otp } = await req.json()
    if (!phone || !otp) {
      return new Response(JSON.stringify({ error: 'phone and otp required' }), { status: 400, headers: cors })
    }

    // Africa's Talking — sandbox for testing, live for production
    const isLive = AT_USERNAME !== 'sandbox'
    const atUrl  = isLive
      ? 'https://api.africastalking.com/version1/messaging'
      : 'https://api.sandbox.africastalking.com/version1/messaging'

    const body = new URLSearchParams({
      username: AT_USERNAME,
      to:       phone,
      message:  `Your FindMyChopper verification code is: ${otp}. Valid for 10 minutes.`,
    })
    if (AT_SENDER && isLive) body.set('from', AT_SENDER)

    const atRes  = await fetch(atUrl, {
      method:  'POST',
      headers: {
        'Accept':       'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        'apikey':       AT_KEY,
      },
      body,
    })
    const atData = await atRes.json()

    // Check Africa's Talking response for errors
    const recipient = atData.SMSMessageData?.Recipients?.[0]
    if (recipient && recipient.status !== 'Success' && recipient.statusCode !== 101) {
      console.error('AT error:', JSON.stringify(atData))
    }

    // Store OTP server-side so client can verify
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    )
    await supabase.from('otps').upsert({
      phone,
      code:       otp,
      expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    })

    return new Response(JSON.stringify({ ok: true, provider: 'africastalking', at: atData }), {
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-sms error:', err)
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...cors, 'Content-Type': 'application/json' },
    })
  }
})
