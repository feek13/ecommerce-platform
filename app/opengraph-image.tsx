import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = '智选商城 - 您的在线购物平台'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          fontFamily: 'system-ui',
        }}
      >
        {/* Shopping Cart Icon */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '40px',
          }}
        >
          <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 2L7.17 6H2.18C1.43 6 0.870003 6.68 1.03 7.41L2.8 15.28C2.94 15.91 3.53 16.35 4.18 16.35H17.82C18.47 16.35 19.06 15.91 19.2 15.28L20.97 7.41C21.13 6.68 20.57 6 19.82 6H14.83L13 2H9Z"
              fill="white"
              opacity="0.95"
            />
            <circle cx="8.5" cy="20" r="1.5" fill="white" opacity="0.95" />
            <circle cx="16.5" cy="20" r="1.5" fill="white" opacity="0.95" />
          </svg>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '72px',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '20px',
            textAlign: 'center',
            letterSpacing: '-0.02em',
          }}
        >
          智选商城
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '36px',
            color: 'rgba(255, 255, 255, 0.9)',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          您的在线购物平台
        </div>

        {/* Features */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            fontSize: '24px',
            color: 'rgba(255, 255, 255, 0.85)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            ✓ 品质保证
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            ✓ 安全可靠
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            ✓ 极速配送
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
