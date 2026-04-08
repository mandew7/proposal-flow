import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { getProposalById } from "@/lib/services/proposal-service";
import { formatCurrency, formatDate } from "@/lib/format";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const { id } = await params;
  const proposalData = await getProposalById(user.id, id);

  if (!proposalData) {
    return new NextResponse("Proposal not found.", { status: 404 });
  }

  const { proposal } = proposalData;
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([612, 792]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdf.embedFont(StandardFonts.HelveticaBold);

  page.drawText("ProposalFlow", { x: 50, y: 740, size: 20, font: boldFont, color: rgb(0.06, 0.09, 0.16) });
  page.drawText(proposal.title, { x: 50, y: 700, size: 24, font: boldFont, color: rgb(0.06, 0.09, 0.16) });
  page.drawText(`Client: ${proposal.client?.company ?? "No client"}`, { x: 50, y: 665, size: 12, font });
  page.drawText(`Contact: ${proposal.client?.name ?? "No contact"}`, { x: 50, y: 645, size: 12, font });
  page.drawText(`Amount: ${formatCurrency(proposal.amount)}`, { x: 50, y: 625, size: 12, font });
  page.drawText(`Status: ${proposal.status}`, { x: 50, y: 605, size: 12, font });
  page.drawText(`Due: ${formatDate(proposal.dueDate)}`, { x: 50, y: 585, size: 12, font });
  page.drawText("Description", { x: 50, y: 545, size: 14, font: boldFont });

  const lines = proposal.description.match(/.{1,90}(\s|$)/g) ?? [proposal.description];
  let currentY = 520;
  for (const line of lines.slice(0, 12)) {
    page.drawText(line.trim(), { x: 50, y: currentY, size: 11, font, color: rgb(0.2, 0.24, 0.31) });
    currentY -= 18;
  }

  const bytes = await pdf.save();

  return new NextResponse(Buffer.from(bytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${proposal.title.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}.pdf"`,
    },
  });
}
