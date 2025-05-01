import React from 'react';
import { Linkedin, Mail, Twitter, Instagram } from 'lucide-react';
import Image from 'next/image';
import { Metadata } from 'next';

const members = [
    {
        name: 'Pedro Curvo',
        role: 'Creator - Developer',
        avatar: '/team/pedro.webp',
        linkedin: 'https://www.linkedin.com/in/pedro-curvo/',
    },
    {
        name: 'Clara Vasconcelos',
        role: 'Creator',
        avatar: '/team/pedro.webp',
        linkedin: 'https://www.linkedin.com/in/clara-vasconcelos-9724b8243/',
    },
    {
        name: 'Tomás Duarte',
        role: 'Creator',
        avatar: '/team/pedro.webp',
        linkedin: 'www.linkedin.com/in/clara-vasconcelos-9724b8243/',
    },
]

export const metadata: Metadata = {
    title: "Contacto | DespesaPública.pt",
    description: "Conheça a equipa por trás do DespesaPública.pt, uma plataforma dedicada à transparência e análise da despesa pública em Portugal.",
};

export default function TeamPage() {
    return (
        <div className="container mx-auto pb-16">
            <section className="py-12">
                <div className="mx-auto max-w-3xl px-8 lg:px-0">
                <h2 className="text-3xl font-bold mb-8">Equipa</h2>
                    <div>
                        <div className="grid grid-cols-2 gap-4 py-6 md:grid-cols-4">
                            {members.map((member, index) => (
                                <div key={index}>
                                    <div className="bg-background size-20 rounded-full border p-0.5 shadow shadow-zinc-950/5 relative group">
                                        <Image 
                                            className="aspect-square rounded-full object-cover" 
                                            src={member.avatar} 
                                            alt={member.name} 
                                            height={460} 
                                            width={460} 
                                            loading="lazy" 
                                        />
                                        <a 
                                            href={member.linkedin} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                                            aria-label={`${member.name}'s LinkedIn profile`}
                                        >
                                            <Linkedin className="text-white h-8 w-8" />
                                        </a>
                                    </div>
                                    <span className="mt-2 block text-sm">{member.name}</span>
                                    <span className="text-muted-foreground block text-xs">{member.role}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-12 border-t">
                <div className="mx-auto max-w-3xl px-8 lg:px-0">
                    <h2 className="text-3xl font-bold mb-8">Contacto</h2>
                    
                    <p className="text-muted-foreground mb-6">
                        Se tiver alguma dúvida ou sugestão, não hesite em entrar em contacto connosco.
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                        <Mail className="h-5 w-5" />
                        <a href="mailto:contact@DespesaPública.pt" className="text-blue-500 hover:underline">
                        contact@DespesaPública.pt
                        </a>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">Ou seguir-nos nas redes sociais:</p>
                    
                    <div className="flex gap-4">
                        <a 
                            href="https://twitter.com/DespesaPública.pt" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-background hover:bg-gray-100 dark:hover:bg-gray-800 size-10 rounded-full flex items-center justify-center border transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a 
                            href="https://instagram.com/DespesaPública.pt" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-background hover:bg-gray-100 dark:hover:bg-gray-800 size-10 rounded-full flex items-center justify-center border transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a 
                            href="https://linkedin.com/company/DespesaPública.pt" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-background hover:bg-gray-100 dark:hover:bg-gray-800 size-10 rounded-full flex items-center justify-center border transition-colors"
                            aria-label="LinkedIn"
                        >
                            <Linkedin className="h-5 w-5" />
                        </a>
                    </div>
                </div>
            </section>
        </div>
    );
}