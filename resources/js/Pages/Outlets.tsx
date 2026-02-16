import { Head } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import { MapPin, Phone, Clock } from 'lucide-react';
import Card from '@/Components/UI/Card';

export default function Outlets() {
    // TODO: Replace with backend data when API is ready
    const outlets = [
        {
            id: 1,
            name: '1st Outlets',
            address: 'Azizi bakin, 28 Nabab sirajuddoula road,anderikilla.',
            phone: '01976-088448',
            image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&h=400&fit=crop',
        },
        {
            id: 2,
            name: '2nd Outlets',
            address: '247, Kawas sirajuddoula road, Chandanpura, Ctg',
            phone: '01898-467818',
            image: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?w=600&h=400&fit=crop',
        },
        {
            id: 3,
            name: '3rd Outlets',
            address: 'Apdi bakin, 26 Nabab sirajuddoula road,anderikilla.',
            phone: '01764-150962',
            image: 'https://images.unsplash.com/photo-1556912172-45b7abe8b7e1?w=600&h=400&fit=crop',
        },
        {
            id: 4,
            name: '4th Deuri Outlets',
            address: '37, SS Khaled road, Mollika khabon, Kazir dewri, Ctg',
            phone: '01984-122071',
            image: 'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=600&h=400&fit=crop',
        },
        {
            id: 5,
            name: '5th Outlets',
            address: 'Shop no.03, Burdy paint Ltd, Bangladesh freedom fighters welfare Trust, 215/216 Industrial area, Nasir abad, Bayezid, Ctg',
            phone: '01000000000',
            image: 'https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop',
        },
        {
            id: 6,
            name: 'Cantonment Outlets',
            address: 'Shop no.03, Burdy paint Ltd, Bangladesh freedom fighters welfare Trust, 215/216 Industrial area, Nasir abad, Bayezid, Ctg',
            phone: '01000000000',
            image: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&h=400&fit=crop',
        },
    ];

    return (
        <GuestLayout>
            <Head title="Our Outlets" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-400 via-primary-300 to-neutral-100 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-display text-display-l md:text-display-xl text-primary mb-4">
                        Discover Quality Products
                    </h1>
                    <h2 className="font-display text-display-m text-accent-orange mb-4">
                        Our All Outlets
                    </h2>
                    <p className="text-lg text-typography-75 max-w-2xl mx-auto">
                        Stay informed with the latest developments, exclusive deals, and stories that matter. From new product launches and special events
                    </p>
                </div>
            </section>

            {/* Outlets Grid */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="font-display text-display-m text-primary mb-4">
                            Our All Outlets
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {outlets.map((outlet) => (
                            <Card key={outlet.id} hover padding="none" className="overflow-hidden">
                                <div className="relative h-56 overflow-hidden">
                                    <img
                                        src={outlet.image}
                                        alt={outlet.name}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-semibold text-typography-100 mb-4">
                                        {outlet.name}
                                    </h3>

                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <MapPin size={20} className="text-accent-orange flex-shrink-0 mt-1" />
                                            <p className="text-sm text-typography-300">
                                                {outlet.address}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <Phone size={20} className="text-accent-orange flex-shrink-0" />
                                            <a
                                                href={`tel:${outlet.phone}`}
                                                className="text-sm text-typography-300 hover:text-accent-orange transition-colors"
                                            >
                                                {outlet.phone}
                                            </a>
                                        </div>

                                        <div className="flex items-start gap-3 pt-3 border-t border-neutral-200">
                                            <Clock size={20} className="text-accent-orange flex-shrink-0 mt-1" />
                                            <div className="text-sm text-typography-300">
                                                <p className="font-semibold text-typography-100">Everyday Opening Time:</p>
                                                <p>08:00AM-10:00 PM</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Map Section - Placeholder */}
            <section className="py-16 bg-neutral-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-8">
                        <h2 className="font-display text-display-m text-primary mb-4">
                            Find Us on Map
                        </h2>
                        <p className="text-typography-300">
                            Visit any of our convenient locations
                        </p>
                    </div>

                    {/* TODO: Integrate Google Maps API */}
                    <div className="bg-neutral-200 rounded-lg h-96 flex items-center justify-center">
                        <div className="text-center">
                            <MapPin size={48} className="text-neutral-400 mx-auto mb-4" />
                            <p className="text-typography-300">
                                Map integration coming soon
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
