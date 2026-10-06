import os
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def build_pdf():
    pdf_path = os.path.abspath("AFICHE_SOLUCION.pdf")
    
    # 10mm top/bottom, 12mm left/right
    margin = 32
    doc = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=margin,
        rightMargin=margin,
        topMargin=26,
        bottomMargin=26
    )

    styles = getSampleStyleSheet()
    
    # Color palette
    NAVY_DARK = colors.HexColor("#0B132B")
    NAVY_CARD = colors.HexColor("#111D33")
    NAVY_LIGHT = colors.HexColor("#1C2A44")
    BLUE_PRIMARY = colors.HexColor("#2563EB")
    BLUE_ACCENT = colors.HexColor("#38BDF8")
    TEXT_LIGHT = colors.HexColor("#F8FAFC")
    TEXT_MUTED = colors.HexColor("#94A3B8")
    TEXT_BODY = colors.HexColor("#CBD5E1")
    EMERALD = colors.HexColor("#10B981")
    AMBER = colors.HexColor("#F59E0B")
    RED_EMERGENCY = colors.HexColor("#EF4444")
    LINE_BORDER = colors.HexColor("#233554")

    # Typography styles
    style_header_title = ParagraphStyle(
        'HeaderTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=17,
        leading=21,
        textColor=TEXT_LIGHT,
        alignment=TA_LEFT
    )

    style_header_subtitle = ParagraphStyle(
        'HeaderSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=BLUE_ACCENT,
        alignment=TA_LEFT
    )

    style_header_tag = ParagraphStyle(
        'HeaderTag',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8.5,
        leading=11,
        textColor=TEXT_LIGHT,
        alignment=TA_RIGHT
    )

    style_header_tag_sub = ParagraphStyle(
        'HeaderTagSub',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=TEXT_MUTED,
        alignment=TA_RIGHT
    )

    style_section_title = ParagraphStyle(
        'SectionTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13,
        textColor=BLUE_ACCENT,
        spaceBefore=7,
        spaceAfter=3
    )

    style_vision_text = ParagraphStyle(
        'VisionText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=11.5,
        textColor=TEXT_BODY,
        alignment=TA_JUSTIFY
    )

    style_card_title = ParagraphStyle(
        'CardTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9,
        leading=11,
        textColor=TEXT_LIGHT,
        alignment=TA_LEFT
    )

    style_card_text = ParagraphStyle(
        'CardText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.5,
        leading=10,
        textColor=TEXT_BODY,
        alignment=TA_LEFT
    )

    style_flow_box_title = ParagraphStyle(
        'FlowTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=10,
        textColor=TEXT_LIGHT,
        alignment=TA_CENTER
    )

    style_flow_box_desc = ParagraphStyle(
        'FlowDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=6.8,
        leading=8.5,
        textColor=TEXT_MUTED,
        alignment=TA_CENTER
    )

    style_arrow = ParagraphStyle(
        'Arrow',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=10,
        textColor=BLUE_ACCENT,
        alignment=TA_CENTER
    )

    style_arrow_sub = ParagraphStyle(
        'ArrowSub',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=5.5,
        leading=7,
        textColor=TEXT_MUTED,
        alignment=TA_CENTER
    )

    style_th = ParagraphStyle(
        'TableHead',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=TEXT_LIGHT
    )

    style_td = ParagraphStyle(
        'TableBody',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7.2,
        leading=9,
        textColor=TEXT_BODY
    )

    style_td_bold = ParagraphStyle(
        'TableBodyBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.2,
        leading=9,
        textColor=TEXT_LIGHT
    )

    style_footer_text = ParagraphStyle(
        'FooterText',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7,
        leading=9,
        textColor=TEXT_MUTED
    )

    style_footer_badge = ParagraphStyle(
        'FooterBadge',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7,
        leading=9,
        textColor=EMERALD,
        alignment=TA_RIGHT
    )

    story = []

    # ----------------------------------------------------
    # 1. HEADER BANNER
    # ----------------------------------------------------
    header_left = [
        Paragraph("ALERTA GUADALUPE", style_header_title),
        Paragraph("SISTEMA INTEGRADO DE SEGURIDAD CIUDADANA Y DESPACHO CERO", style_header_subtitle)
    ]
    header_right = [
        Paragraph("Distrito de Guadalupe", style_header_tag),
        Paragraph("Provincia de Pacasmayo • La Libertad", style_header_tag_sub)
    ]

    header_table = Table(
        [[header_left, header_right]],
        colWidths=[360, 171]
    )
    header_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NAVY_DARK),
        ('BOX', (0,0), (-1,-1), 1.2, BLUE_PRIMARY),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 10),
        ('ROUNDEDCORNERS', [6, 6, 6, 6])
    ]))
    story.append(header_table)
    story.append(Spacer(1, 7))

    # ----------------------------------------------------
    # 2. SECCIÓN 1: VISIÓN GENERAL
    # ----------------------------------------------------
    story.append(Paragraph("1. VISIÓN GENERAL DE LA SOLUCIÓN", style_section_title))
    
    vision_content = Paragraph(
        "<b>Alerta Guadalupe</b> es una plataforma cívico-tecnológica diseñada para erradicar las demoras y saturaciones de las llamadas telefónicas tradicionales de auxilio. "
        "Permite a cualquier vecino en situación de riesgo reportar incidentes con <b>un solo toque</b> desde su teléfono inteligente, transmitiendo su posición GPS satelital exacta, "
        "datos verificados de identidad y evidencia multimedia directamente a la Central de Operaciones de Serenazgo (C4) en menos de <b>500 milisegundos</b>, "
        "agilizando la intervención inmediata sobre la <b>Malla Táctica de 12 Cuadrantes</b> del distrito.",
        style_vision_text
    )
    vision_box = Table([[vision_content]], colWidths=[531])
    vision_box.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NAVY_CARD),
        ('BOX', (0,0), (-1,-1), 0.8, LINE_BORDER),
        ('LINEBEFORE', (0,0), (0,0), 3.5, BLUE_PRIMARY),
        ('PADDING', (0,0), (-1,-1), 8),
        ('ROUNDEDCORNERS', [4, 4, 4, 4])
    ]))
    story.append(vision_box)
    story.append(Spacer(1, 6))

    # ----------------------------------------------------
    # 3. SECCIÓN 2: ARQUITECTURA DE DESPACHO INMEDIATO (FLOW)
    # ----------------------------------------------------
    story.append(Paragraph("2. ARQUITECTURA OPERATIVA DE DESPACHO CERO", style_section_title))
    
    f1 = [Paragraph("APP CIUDADANO", style_flow_box_title), Paragraph("Android Nativo<br/>DNI + GPS Fused", style_flow_box_desc)]
    a1 = [Paragraph("→", style_arrow)]
    f2 = [Paragraph("VERCEL API", style_flow_box_title), Paragraph("Serverless Node<br/>Latencia &lt; 80ms", style_flow_box_desc)]
    a2 = [Paragraph("→", style_arrow)]
    f3 = [Paragraph("SUPABASE CLOUD", style_flow_box_title), Paragraph("PostgreSQL Live<br/>WebSockets", style_flow_box_desc)]
    a3 = [Paragraph("→", style_arrow)]
    f4 = [Paragraph("CENTRAL C4", style_flow_box_title), Paragraph("Dashboard Táctico<br/>12 Cuadrantes", style_flow_box_desc)]
    a4 = [Paragraph("→", style_arrow)]
    f5 = [Paragraph("PATRULLA CUADRANTE", style_flow_box_title), Paragraph("Intervención<br/>Inmediata", style_flow_box_desc)]

    flow_table = Table(
        [[f1, a1, f2, a2, f3, a3, f4, a4, f5]],
        colWidths=[92, 16, 92, 16, 92, 16, 92, 16, 95]
    )
    flow_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (0,0), NAVY_LIGHT),
        ('BACKGROUND', (2,0), (2,0), NAVY_LIGHT),
        ('BACKGROUND', (4,0), (4,0), NAVY_LIGHT),
        ('BACKGROUND', (6,0), (6,0), NAVY_LIGHT),
        ('BACKGROUND', (8,0), (8,0), NAVY_LIGHT),
        ('BOX', (0,0), (0,0), 0.8, BLUE_PRIMARY),
        ('BOX', (2,0), (2,0), 0.8, BLUE_ACCENT),
        ('BOX', (4,0), (4,0), 0.8, colors.HexColor("#8B5CF6")),
        ('BOX', (6,0), (6,0), 0.8, EMERALD),
        ('BOX', (8,0), (8,0), 0.8, colors.HexColor("#F97316")),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROUNDEDCORNERS', [4, 4, 4, 4])
    ]))
    story.append(flow_table)
    story.append(Spacer(1, 6))

    # ----------------------------------------------------
    # 4. SECCIÓN 3: PILARES TECNOLÓGICOS (3 COLUMNAS)
    # ----------------------------------------------------
    story.append(Paragraph("3. COMPONENTES PRINCIPALES DE LA PLATAFORMA", style_section_title))

    col_app = [
        Paragraph("<b>[A] App Móvil Ciudadana</b>", style_card_title),
        Spacer(1, 3),
        Paragraph("• <b>DNI Autenticado:</b> Registro con DNI y teléfono para erradicar avisos falsos.", style_card_text),
        Spacer(1, 2),
        Paragraph("• <b>3 Niveles de Alerta:</b> Emergencia (Rojo), Seguridad (Azul) y Sospechosa (Naranja).", style_card_text),
        Spacer(1, 2),
        Paragraph("• <b>GPS Fused Provider:</b> Coordenadas satelitales automáticas con precisión métrica.", style_card_text),
        Spacer(1, 2),
        Paragraph("• <b>Evidencia Multimedia:</b> Adjunto de fotografía o video capturado en el instante.", style_card_text)
    ]

    col_c4 = [
        Paragraph("<b>[B] Central C4 Serenazgo</b>", style_card_title),
        Spacer(1, 3),
        Paragraph("• <b>Malla Táctica 3x4:</b> 12 cuadrantes continuos del casco urbano sin solapamientos.", style_card_text),
        Spacer(1, 2),
        Paragraph("• <b>Alarma Auditiva y Visual:</b> Sonido de sirena y banner emergente prioritario en vivo.", style_card_text),
        Spacer(1, 2),
        Paragraph("• <b>Filtros Geográficos:</b> Filtrado instantáneo por cuadrante, tipo de delito y ciudadano.", style_card_text),
        Spacer(1, 2),
        Paragraph("• <b>Ficha de Despacho:</b> Tiempo transcurrido, contacto del vecino y enlace Google Maps.", style_card_text)
    ]

    col_cloud = [
        Paragraph("<b>[C] Infraestructura Cloud</b>", style_card_title),
        Spacer(1, 3),
        Paragraph("• <b>Vercel Serverless:</b> Arquitectura perimetral resiliente 24/7 sin servidores locales.", style_card_text),
        Spacer(1, 2),
        Paragraph("• <b>PostgreSQL + RLS:</b> Base de datos transaccional con seguridad a nivel de fila.", style_card_text),
        Spacer(1, 2),
        Paragraph("• <b>WebSockets Realtime:</b> Notificación push simultánea multi-pantalla sin latencia.", style_card_text),
        Spacer(1, 2),
        Paragraph("• <b>Costo Cero de Mantenimiento:</b> Alta eficiencia económica para el municipio.", style_card_text)
    ]

    pillars_table = Table(
        [[col_app, col_c4, col_cloud]],
        colWidths=[173, 173, 173]
    )
    pillars_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NAVY_CARD),
        ('BOX', (0,0), (0,0), 0.8, BLUE_PRIMARY),
        ('BOX', (1,0), (1,0), 0.8, BLUE_ACCENT),
        ('BOX', (2,0), (2,0), 0.8, colors.HexColor("#8B5CF6")),
        ('LINEBEFORE', (0,0), (0,0), 2.5, BLUE_PRIMARY),
        ('LINEBEFORE', (1,0), (1,0), 2.5, BLUE_ACCENT),
        ('LINEBEFORE', (2,0), (2,0), 2.5, colors.HexColor("#8B5CF6")),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 7),
        ('ROUNDEDCORNERS', [4, 4, 4, 4])
    ]))
    story.append(pillars_table)
    story.append(Spacer(1, 6))

    # ----------------------------------------------------
    # 5. SECCIÓN 4: FICHA TÉCNICA
    # ----------------------------------------------------
    story.append(Paragraph("4. FICHA TÉCNICA RESUMIDA", style_section_title))

    data_table = [
        [Paragraph("Componente", style_th), Paragraph("Tecnologías Empleadas", style_th), Paragraph("Rol Operativo en la Solución", style_th)],
        [Paragraph("<b>App Móvil Ciudadana</b>", style_td_bold), Paragraph("Kotlin, Jetpack Compose, Coroutines, OkHttp3", style_td), Paragraph("Reporte en 1 toque, captura multimedia y GPS Fused", style_td)],
        [Paragraph("<b>Dashboard Web C4</b>", style_td_bold), Paragraph("React 19, Vite, TailwindCSS, Leaflet OpenStreetMap", style_td), Paragraph("Monitoreo táctico multi-pantalla y despacho en vivo", style_td)],
        [Paragraph("<b>Backend Serverless</b>", style_td_bold), Paragraph("Node.js Serverless Functions en Vercel Edge", style_td), Paragraph("Ingesta, validación de payload y enrutamiento seguro", style_td)],
        [Paragraph("<b>Base de Datos Cloud</b>", style_td_bold), Paragraph("PostgreSQL con WebSockets en Supabase", style_td), Paragraph("Persistencia segura con RLS y distribución Realtime", style_td)],
        [Paragraph("<b>Cobertura Territorial</b>", style_td_bold), Paragraph("Malla Táctica 3x4 (12 Cuadrantes continuos)", style_td), Paragraph("Distrito de Guadalupe: Casco Histórico, Talla, Semán", style_td)]
    ]

    spec_table = Table(data_table, colWidths=[120, 185, 226])
    spec_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), NAVY_LIGHT),
        ('BACKGROUND', (0,1), (-1,-1), NAVY_CARD),
        ('GRID', (0,0), (-1,-1), 0.5, LINE_BORDER),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 4.2),
        ('ROUNDEDCORNERS', [4, 4, 4, 4])
    ]))
    story.append(spec_table)
    story.append(Spacer(1, 6))

    # ----------------------------------------------------
    # 6. SECCIÓN 5: PROTOCOLO DE INTERVENCIÓN (4 PASOS)
    # ----------------------------------------------------
    story.append(Paragraph("5. PROTOCOLO DE RESPUESTA OPERATIVA EN 4 FASES", style_section_title))

    p1 = [Paragraph("<b>Fase 1: Activación</b>", style_flow_box_title), Spacer(1, 2), Paragraph("El vecino presiona el botón de pánico en su app móvil.", style_card_text)]
    p2 = [Paragraph("<b>Fase 2: Transmisión</b>", style_flow_box_title), Spacer(1, 2), Paragraph("Transmisión cifrada HTTPS (&lt; 500ms) con GPS y DNI.", style_card_text)]
    p3 = [Paragraph("<b>Fase 3: Focalización C4</b>", style_flow_box_title), Spacer(1, 2), Paragraph("Alarma acústica inmediata y centrado del cuadrante.", style_card_text)]
    p4 = [Paragraph("<b>Fase 4: Despacho</b>", style_flow_box_title), Spacer(1, 2), Paragraph("Despacho radial a patrulla asignada para auxilio veloz.", style_card_text)]

    protocol_table = Table([[p1, p2, p3, p4]], colWidths=[129, 129, 129, 129])
    protocol_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), NAVY_CARD),
        ('BOX', (0,0), (0,0), 0.8, BLUE_PRIMARY),
        ('BOX', (1,0), (1,0), 0.8, BLUE_ACCENT),
        ('BOX', (2,0), (2,0), 0.8, AMBER),
        ('BOX', (3,0), (3,0), 0.8, EMERALD),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('PADDING', (0,0), (-1,-1), 5),
        ('ROUNDEDCORNERS', [4, 4, 4, 4])
    ]))
    story.append(protocol_table)
    story.append(Spacer(1, 8))

    # ----------------------------------------------------
    # 7. FOOTER
    # ----------------------------------------------------
    story.append(HRFlowable(width="100%", thickness=0.8, color=LINE_BORDER, spaceBefore=0, spaceAfter=5))
    footer_table = Table(
        [[Paragraph("© 2026 Alerta Guadalupe • Municipalidad Distrital de Guadalupe • Gerencia de Seguridad Ciudadana", style_footer_text),
          Paragraph("● Sistema 100% Operativo", style_footer_badge)]],
        colWidths=[400, 131]
    )
    footer_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('PADDING', (0,0), (-1,-1), 1)
    ]))
    story.append(footer_table)

    # Build document
    doc.build(story)
    print(f"PDF generado con éxito en: {pdf_path}")

if __name__ == "__main__":
    build_pdf()
