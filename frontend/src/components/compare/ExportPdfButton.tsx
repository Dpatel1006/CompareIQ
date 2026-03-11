'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { FileDown, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { toast } from 'sonner';

interface ExportPdfButtonProps {
    elementId: string;
    filename: string;
}

export function ExportPdfButton({ elementId, filename }: ExportPdfButtonProps) {
    const [isExporting, setIsExporting] = useState(false);

    const exportToPdf = async () => {
        const element = document.getElementById(elementId);
        if (!element) {
            toast.error('Could not find comparison content to export.');
            return;
        }

        setIsExporting(true);
        try {
            // Create a clone or temporary style to ensure best PDF layout
            const canvas = await html2canvas(element, {
                useCORS: true,
                logging: false,
                backgroundColor: '#ffffff', // Ensure white background for PDF
                onclone: (clonedDoc: Document) => {
                    // Hide buttons and other non-pdf elements in the clone
                    const buttons = clonedDoc.querySelectorAll('button');
                    buttons.forEach((btn: Element) => (btn as HTMLElement).style.display = 'none');

                    const shareBtn = clonedDoc.querySelector('[data-share-button]');
                    if (shareBtn) (shareBtn as HTMLElement).style.display = 'none';

                    const relatedSection = clonedDoc.querySelector('[data-related-section]');
                    if (relatedSection) (relatedSection as HTMLElement).style.display = 'none';
                }
            } as any);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 2, canvas.height / 2], // Match canvas size roughly
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${filename}.pdf`);

            toast.success('PDF exported successfully!');
        } catch (error) {
            console.error('PDF export error:', error);
            toast.error('Failed to generate PDF. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="sm"
            onClick={exportToPdf}
            disabled={isExporting}
            className="gap-2 h-9"
        >
            {isExporting ? (
                <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Exporting...
                </>
            ) : (
                <>
                    <FileDown className="h-4 w-4" />
                    Export PDF
                </>
            )}
        </Button>
    );
}
