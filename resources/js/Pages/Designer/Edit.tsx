import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DesignerCanvas from '@/Components/Designer/Canvas';
import { Head, Link } from '@inertiajs/react';
import { CakeDesign } from '@/types';

interface Props {
    design: CakeDesign | null;
}

export default function DesignerEdit({ design }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title={design?.name ?? 'New design'} />
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <Link
                        href={route('designer.index')}
                        className="font-bold uppercase hover:underline"
                    >
                        Back to designs
                    </Link>
                </div>
                <DesignerCanvas
                    initialData={design?.design_data}
                    designId={design?.id}
                    designName={design?.name}
                />
            </div>
        </AuthenticatedLayout>
    );
}
