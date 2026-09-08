/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

interface Item {
  name: string
  quantity: number
}

interface Props {
  orderNumber?: string
  customerName?: string
  shippingMethod?: string
  items?: Item[]
}

const Email = ({ orderNumber, customerName, shippingMethod, items = [] }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your Cell Sync Solutions order is packed and on its way</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={brand}>CELL SYNC SOLUTIONS</Text>
        <Heading style={h1}>Your order is on its way</Heading>
        <Text style={text}>
          {customerName ? `Hi ${customerName},` : 'Hi there,'} your order
          {orderNumber ? ` #${orderNumber}` : ''} has been packed and handed off for shipping
          {shippingMethod ? ` via ${shippingMethod}` : ''}.
        </Text>

        {items.length > 0 && (
          <Section style={card}>
            <Text style={cardTitle}>What's in the box</Text>
            {items.map((it, i) => (
              <Text key={i} style={itemLine}>
                {it.name} &nbsp;×&nbsp; {it.quantity}
              </Text>
            ))}
          </Section>
        )}

        <Hr style={hr} />
        <Text style={fine}>
          All products are supplied strictly for legitimate laboratory and research applications.
          They are not intended for human or veterinary use.
        </Text>
        <Text style={fine}>— The Cell Sync Solutions team</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: 'Your Cell Sync Solutions order has shipped',
  displayName: 'Order fulfilled',
  previewData: {
    orderNumber: 'A1B2C3D4',
    customerName: 'Alex',
    shippingMethod: 'USPS Ground Advantage',
    items: [
      { name: 'GLP-3 RT — 5mg', quantity: 2 },
      { name: 'BPC-157 — 10mg', quantity: 1 },
    ],
  },
} satisfies TemplateEntry

const main = {
  backgroundColor: '#ffffff',
  fontFamily: 'Helvetica, Arial, sans-serif',
  color: 'hsl(0, 0%, 8%)',
}
const container = { padding: '28px 24px', maxWidth: '560px' }
const brand = {
  fontSize: '12px',
  letterSpacing: '2px',
  fontWeight: 700,
  color: 'hsl(205, 70%, 60%)',
  margin: '0 0 16px',
}
const h1 = { fontSize: '24px', fontWeight: 800, margin: '0 0 12px', color: 'hsl(30, 6%, 12%)' }
const text = { fontSize: '15px', lineHeight: '24px', color: 'hsl(0, 0%, 8%)' }
const card = {
  backgroundColor: 'hsl(36, 10%, 94%)',
  borderRadius: '8px',
  padding: '16px 18px',
  margin: '20px 0',
}
const cardTitle = {
  fontSize: '11px',
  letterSpacing: '1.5px',
  textTransform: 'uppercase' as const,
  fontWeight: 700,
  color: 'hsl(30, 6%, 38%)',
  margin: '0 0 10px',
}
const itemLine = { fontSize: '14px', margin: '4px 0', color: 'hsl(0, 0%, 8%)' }
const hr = { borderColor: 'hsl(36, 8%, 90%)', margin: '24px 0' }
const fine = { fontSize: '12px', lineHeight: '18px', color: 'hsl(30, 6%, 38%)' }
