import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { CakeDesign } from '@/types';

interface Props {
    userDesigns: CakeDesign[];
    templates: CakeDesign[];
}

export default function DesignerIndex({ userDesigns, templates }: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Cake Designer" />
            <div className="max-w-6xl mx-auto">
                <h1 className="text-4xl font-black uppercase mb-8 border-b-4 border-black pb-4">
                    Cake Designer
                </h1>

                <Link
                    href={route('designer.create')}
                    className="inline-block px-8 py-4 bg-black text-white font-black uppercase border-4 border-black shadow-[4px_4px_0_0_#000] mb-8"
                >
                    New design
                </Link>

                <section className="mb-12">
                    <h2 className="text-2xl font-black uppercase mb-4">Your designs</h2>
                    {userDesigns.length === 0 ? (
                        <p className="text-gray-600">No designs yet. Create one above.</p>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {userDesigns.map((d) => (
                                <Link
                                    key={d.id}
                                    href={`/designer/${d.id}`}
                                    className="block border-4 border-black p-4 hover:shadow-[8px_8px_0_0_#000] transition-all"
                                >
                                    {d.preview_image_url ? (
                                        <img
                                            src={d.preview_image_url}
                                            alt={d.name ?? 'Design'}
                                            className="w-full h-32 object-cover border-2 border-black mb-2"
                                        />
                                    ) : (
                                        <div className="w-full h-32 bg-gray-200 border-2 border-black mb-2 flex items-center justify-center font-bold">
                                            No preview
                                        </div>
                                    )}
                                    <p className="font-bold truncate">{d.name ?? 'Untitled'}</p>
                                    <p className="text-sm text-gray-600">{d.status}</p>
                                </Link>
                            ))}
                        </div>
                    )}
                </section>

                {templates.length > 0 && (
                    <section>
                        <h2 className="text-2xl font-black uppercase mb-4">Templates</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {templates.map((d) => (
                                <div
                                    key={d.id}
                                    className="border-4 border-black p-4"
                                >
                                    {d.preview_image_url ? (
                                        <img
                                            src={d.preview_image_url}
                                            alt={d.name ?? 'Template'}
                                            className="w-full h-32 object-cover border-2 border-black mb-2"
                                        />
                                    ) : (
                                        <div className="w-full h-32 bg-gray-200 border-2 border-black mb-2" />
                                    )}
                                    <p className="font-bold">{d.name ?? 'Template'}</p>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </AuthenticatedLayout>
    );
}
