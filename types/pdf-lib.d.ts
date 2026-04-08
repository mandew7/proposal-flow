declare module "pdf-lib" {
  export class PDFDocument {
    static create(): Promise<PDFDocument>;
    addPage(size?: [number, number]): {
      drawText: (
        text: string,
        options?: {
          x?: number;
          y?: number;
          size?: number;
          font?: unknown;
          color?: unknown;
        },
      ) => void;
    };
    embedFont(font: unknown): Promise<unknown>;
    save(): Promise<Uint8Array>;
  }

  export const StandardFonts: {
    Helvetica: unknown;
    HelveticaBold: unknown;
  };

  export function rgb(red: number, green: number, blue: number): unknown;
}
