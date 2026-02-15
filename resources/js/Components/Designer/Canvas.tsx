import { useEffect, useRef, useState } from 'react';
import { Square, Circle, Type, Pencil, Trash2, Download, Save } from 'lucide-react';
import { DesignData } from '@/types';

type FabricCanvas = import('fabric').Canvas;

interface CanvasProps {
    initialData?: DesignData | null;
    designId?: string;
    designName?: string | null;
}

export default function DesignerCanvas({ initialData, designId, designName }: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fabricCanvasRef = useRef<FabricCanvas | null>(null);
    const [canvas, setCanvas] = useState<FabricCanvas | null>(null);
    const [selectedTool, setSelectedTool] = useState<string>('select');

    useEffect(() => {
        if (!canvasRef.current) return;
        let mounted = true;

        import('fabric').then((fabric) => {
            if (!mounted || !canvasRef.current) return;
            const fabricCanvas = new fabric.Canvas(canvasRef.current, {
                width: 800,
                height: 600,
                backgroundColor: '#ffffff',
            });
            fabricCanvasRef.current = fabricCanvas;

            const border = new fabric.Rect({
                left: 0,
                top: 0,
                width: 800,
                height: 600,
                fill: 'transparent',
                stroke: '#000000',
                strokeWidth: 4,
                selectable: false,
                evented: false,
            });
            fabricCanvas.add(border);

            setCanvas(fabricCanvas);
        }).catch(() => setCanvas(null));

        return () => {
            mounted = false;
            fabricCanvasRef.current?.dispose();
            fabricCanvasRef.current = null;
            setCanvas(null);
        };
    }, []);

    const addRectangle = () => {
        if (!canvas) return;
        import('fabric').then((fabric) => {
            const rect = new fabric.Rect({
                left: 100,
                top: 100,
                width: 200,
                height: 150,
                fill: '#FF69B4',
                stroke: '#000000',
                strokeWidth: 4,
            });
            canvas.add(rect);
            canvas.setActiveObject(rect);
            canvas.requestRenderAll();
        });
    };

    const addCircle = () => {
        if (!canvas) return;
        import('fabric').then((fabric) => {
            const circle = new fabric.Circle({
                left: 100,
                top: 100,
                radius: 75,
                fill: '#FFB6C1',
                stroke: '#000000',
                strokeWidth: 4,
            });
            canvas.add(circle);
            canvas.setActiveObject(circle);
            canvas.requestRenderAll();
        });
    };

    const addText = () => {
        if (!canvas) return;
        import('fabric').then((fabric) => {
            const text = new fabric.IText('Happy Birthday!', {
                left: 100,
                top: 100,
                fontSize: 40,
                fontFamily: 'Arial',
                fill: '#000000',
            });
            canvas.add(text);
            canvas.setActiveObject(text);
            canvas.requestRenderAll();
        });
    };

    const enableDrawing = () => {
        if (!canvas) return;
        (canvas as FabricCanvas & { isDrawingMode: boolean; freeDrawingBrush?: { color: string; width: number } }).isDrawingMode = true;
        const brush = (canvas as FabricCanvas & { freeDrawingBrush?: { color: string; width: number } }).freeDrawingBrush;
        if (brush) {
            brush.color = '#000000';
            brush.width = 3;
        }
        setSelectedTool('draw');
    };

    const disableDrawing = () => {
        if (!canvas) return;
        (canvas as FabricCanvas & { isDrawingMode: boolean }).isDrawingMode = false;
        setSelectedTool('select');
    };

    const deleteSelected = () => {
        if (!canvas) return;
        const active = canvas.getActiveObjects();
        active.forEach((obj) => canvas.remove(obj));
        canvas.discardActiveObject();
        canvas.requestRenderAll();
    };

    const handleSave = () => {
        if (!canvas) return;
        const designData: DesignData = {
            version: 1,
            canvas: {
                width: 800,
                height: 600,
                backgroundColor: (canvas.backgroundColor as string) ?? '#ffffff',
            },
            layers: canvas.getObjects().map((obj, i) => ({ id: `layer-${i}`, data: obj.toObject() })),
        };
        const preview = canvas.toDataURL({ format: 'png', quality: 0.8 });

        const form = document.createElement('form');
        form.method = 'POST';
        form.action = '/designer/save';
        const csrf = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
        if (csrf) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = '_token';
            input.value = csrf;
            form.appendChild(input);
        }
        const dataInput = document.createElement('input');
        dataInput.type = 'hidden';
        dataInput.name = 'design_data';
        dataInput.value = JSON.stringify(designData);
        form.appendChild(dataInput);
        const previewInput = document.createElement('input');
        previewInput.type = 'hidden';
        previewInput.name = 'preview_image_url';
        previewInput.value = preview;
        form.appendChild(previewInput);
        if (designName) {
            const nameInput = document.createElement('input');
            nameInput.type = 'hidden';
            nameInput.name = 'name';
            nameInput.value = designName;
            form.appendChild(nameInput);
        }
        document.body.appendChild(form);
        form.submit();
    };

    const handleExport = () => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({ format: 'png', quality: 1.0 });
        const link = document.createElement('a');
        link.download = 'cake-design.png';
        link.href = dataURL;
        link.click();
    };

    if (canvas === null) {
        return (
            <div className="border-4 border-black p-8 text-center">
                <p className="font-bold mb-4">Loading canvas...</p>
            </div>
        );
    }

    return (
        <div className="flex gap-4 flex-wrap">
            <div className="w-20 bg-white border-4 border-black p-2 space-y-2 shrink-0">
                <button
                    type="button"
                    onClick={disableDrawing}
                    className={`w-full p-3 border-4 border-black ${selectedTool === 'select' ? 'bg-amber-400' : 'bg-white'} hover:bg-amber-400`}
                    title="Select"
                >
                    <Type size={24} className="mx-auto" />
                </button>
                <button type="button" onClick={addRectangle} className="w-full p-3 border-4 border-black bg-white hover:bg-amber-400" title="Rectangle">
                    <Square size={24} className="mx-auto" />
                </button>
                <button type="button" onClick={addCircle} className="w-full p-3 border-4 border-black bg-white hover:bg-amber-400" title="Circle">
                    <Circle size={24} className="mx-auto" />
                </button>
                <button type="button" onClick={addText} className="w-full p-3 border-4 border-black bg-white hover:bg-amber-400" title="Text">
                    <Type size={24} className="mx-auto" />
                </button>
                <button
                    type="button"
                    onClick={enableDrawing}
                    className={`w-full p-3 border-4 border-black ${selectedTool === 'draw' ? 'bg-amber-400' : 'bg-white'} hover:bg-amber-400`}
                    title="Draw"
                >
                    <Pencil size={24} className="mx-auto" />
                </button>
                <div className="border-t-4 border-black my-2" />
                <button type="button" onClick={deleteSelected} className="w-full p-3 border-4 border-black bg-white hover:bg-red-400" title="Delete">
                    <Trash2 size={24} className="mx-auto" />
                </button>
                <button type="button" onClick={handleSave} className="w-full p-3 border-4 border-black bg-green-400 hover:bg-green-500" title="Save">
                    <Save size={24} className="mx-auto" />
                </button>
                <button type="button" onClick={handleExport} className="w-full p-3 border-4 border-black bg-blue-400 hover:bg-blue-500" title="Export">
                    <Download size={24} className="mx-auto" />
                </button>
            </div>
            <div className="border-4 border-black shadow-[8px_8px_0_0_#000]">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}
