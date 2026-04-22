import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const alt = 'Zonacrono Event';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image(props: { params: Promise<{ event: string }> }) {
  const params = await props.params;
  const tenantId = params.event;
  
  let tenantTitle = 'Evento Deportivo';
  let tenantCity = '';
  let tenantDate = '';
  let primaryColor = '#ff3333';

  try {
    const filePath = path.join(process.cwd(), "src/data/tenants", `${tenantId}.json`);
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, "utf8");
      const data = JSON.parse(fileContents);
      tenantTitle = data.title || tenantTitle;
      tenantCity = data.city || tenantCity;
      tenantDate = data.eventDate || tenantDate;
      primaryColor = data.primaryColor || primaryColor;
    }
  } catch (error) {
    console.error("Error reading tenant data for og:", error);
  }

  return new ImageResponse(
    (
      <div
        style={{
          backgroundColor: '#0a0a0a',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          color: 'white',
          padding: 80,
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
             <div style={{ width: 24, height: 24, borderRadius: 12, backgroundColor: primaryColor, marginRight: 16 }}></div>
             <span style={{ fontSize: 32, fontWeight: 600, color: '#888' }}>ZONACRONO</span>
          </div>
          <h1 style={{ fontSize: 80, fontWeight: 900, lineHeight: 1.1, margin: 0, marginBottom: 40, maxWidth: 900, textTransform: 'uppercase' }}>
            {tenantTitle}
          </h1>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '2px solid #333', paddingTop: 40 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tenantDate && (
              <span style={{ fontSize: 36, color: '#f0f0f0', fontWeight: 500 }}>📅 {tenantDate}</span>
            )}
            {tenantCity && (
              <span style={{ fontSize: 36, color: '#a0a0a0' }}>📍 {tenantCity}</span>
            )}
          </div>
          <div style={{ 
            padding: '16px 32px', 
            backgroundColor: primaryColor, 
            borderRadius: 12, 
            fontSize: 32, 
            fontWeight: 700 
          }}>
            Inscríbete
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
