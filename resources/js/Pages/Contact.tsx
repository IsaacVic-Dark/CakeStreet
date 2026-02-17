import { Head, Link } from '@inertiajs/react';
import GuestLayout from '@/Layouts/GuestLayout';
import Button from '@/Components/UI/Button';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import Input from '@/Components/UI/Input';
import Card from '@/Components/UI/Card';

export default function Contact() {
    return (
        <GuestLayout>
            <Head title="Contact Us" />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-br from-primary-400 via-primary-300 to-neutral-100 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="font-display text-display-l md:text-display-xl text-primary mb-4">
                        Get in Touch Today
                    </h1>
                    <p className="text-lg max-w-2xl mx-auto">
                        We'd love to hear from you! Whether you have questions about our products, need assistance, or want to place a custom order.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Contact Information */}
                        <div>
                            <h2 className="font-display text-display-s text-primary mb-6">
                                Contact Us
                            </h2>
                            <p className="mb-8">
                                We'd love to hear from you! Whether you have questions about our products, need assistance.
                            </p>

                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center flex-shrink-0">
                                        <MapPin size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Address</h3>
                                        <p className="">
                                            Gopal Mansion, 28 Nabab Siraj<br />
                                            Ud Daula Rd, Chittagong 4000
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Phone size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Phone Number</h3>
                                        <a href="tel:01976-088448" className="hover:text-accent-orange transition-colors">
                                            01976-088448
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Mail size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Email</h3>
                                        <a href="mailto:example@gmail.com" className="hover:text-accent-orange transition-colors">
                                            example@gmail.com
                                        </a>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-primary-400 rounded-full flex items-center justify-center flex-shrink-0">
                                        <Clock size={24} className="text-primary" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold mb-1">Opening Time</h3>
                                        <p className="">
                                            Everyday Opening Time:<br />
                                            08:00AM-10:00 PM
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Map Placeholder */}
                            <div className="mt-8 bg-neutral-200 rounded-lg h-64 flex items-center justify-center">
                                <div className="text-center">
                                    <MapPin size={48} className="text-neutral-400 mx-auto mb-2" />
                                    <p className="">Map integration coming soon</p>
                                </div>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <Card padding="lg">
                            <h3 className="font-display text-display-s text-primary mb-6">
                                Send us a Message
                            </h3>
                            <form className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <Input
                                        label="First Name"
                                        type="text"
                                        placeholder="First Name"
                                    />
                                    <Input
                                        label="Last Name"
                                        type="text"
                                        placeholder="Last Name"
                                    />
                                </div>
                                <Input
                                    label="Email"
                                    type="email"
                                    placeholder="Email"
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    placeholder="Phone Number"
                                />
                                <div>
                                    <label className="block text-sm font-medium mb-1.5">
                                        Message
                                    </label>
                                    <textarea
                                        rows={5}
                                        placeholder="Message"
                                        className="block w-full px-4 py-2.5 bg-white border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                                    />
                                </div>
                                <Button variant="primary" size="lg" className="w-full">
                                    Submit
                                </Button>
                            </form>
                        </Card>
                    </div>
                </div>
            </section>
        </GuestLayout>
    );
}
