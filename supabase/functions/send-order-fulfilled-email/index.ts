import { createClient } from 'npm:@supabase/supabase-js@2'
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors'
import { sendTemplateEmail } from '../_shared/transactional-email-templates/send-email.ts'

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const authHeader = req.headers.get('Authorization') ?? ''
    if (!authHeader) return json({ error: 'Unauthorized' }, 401)

    const url = Deno.env.get('SUPABASE_URL')!
    const anon = Deno.env.get('SUPABASE_ANON_KEY')!
    const service = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    const userClient = createClient(url, anon, {
      global: { headers: { Authorization: authHeader } },
    })
    const { data: userData } = await userClient.auth.getUser()
    const user = userData?.user
    if (!user) return json({ error: 'Unauthorized' }, 401)

    const admin = createClient(url, service)
    const { data: isAdmin } = await admin.rpc('has_role', { _user_id: user.id, _role: 'admin' })
    if (!isAdmin) return json({ error: 'Forbidden' }, 403)

    const body = await req.json().catch(() => ({}))
    const orderId = typeof body?.orderId === 'string' ? body.orderId.trim() : ''
    if (!/^[0-9a-f-]{36}$/i.test(orderId)) return json({ error: 'Invalid orderId' }, 400)

    const { data: order, error } = await admin
      .from('orders')
      .select('id, user_id, shipping_name, shipping_method, order_items(product_name, variant, quantity)')
      .eq('id', orderId)
      .maybeSingle()
    if (error) return json({ error: error.message }, 500)
    if (!order) return json({ error: 'Order not found' }, 404)

    const { data: profile } = await admin
      .from('profiles')
      .select('email, full_name')
      .eq('id', order.user_id)
      .maybeSingle()

    const recipient = profile?.email
    if (!recipient) return json({ sent: false, reason: 'no_email_on_file' })

    const result = await sendTemplateEmail('order-fulfilled', recipient, {
      templateData: {
        orderNumber: order.id.slice(0, 8).toUpperCase(),
        customerName: order.shipping_name || profile?.full_name || '',
        shippingMethod: order.shipping_method || '',
        items: (order.order_items ?? []).map((it: Record<string, unknown>) => ({
          name: `${it.product_name}${it.variant ? ` — ${it.variant}` : ''}`,
          quantity: it.quantity,
        })),
      },
      idempotencyKey: `order-fulfilled-${order.id}`,
    })

    return json({ sent: result?.sent !== false, reason: result?.reason ?? null, recipient })
  } catch (e) {
    return json({ error: e instanceof Error ? e.message : 'Unexpected error' }, 500)
  }
})
