import React from 'react';
import { Linkedin, Mail, Twitter, Instagram } from 'lucide-react';

const members = [
    {
        name: 'Méschac Irung',
        role: 'Creator',
        avatar: 'https://avatars.githubusercontent.com/u/47919550?v=4',
        linkedin: 'https://www.linkedin.com/in/meschac-irung/',
    },
    {
        name: 'Théo Balick',
        role: 'Frontend Dev',
        avatar: 'https://avatars.githubusercontent.com/u/68236786?v=4',
        linkedin: 'https://www.linkedin.com/in/theobalick/',
    },
    {
        name: 'Glodie Lukose',
        role: 'Frontend Dev',
        avatar: 'https://avatars.githubusercontent.com/u/99137927?v=4',
        linkedin: 'https://www.linkedin.com/in/glodie-lukose/',
    },
    {
        name: 'Bernard Ngandu',
        role: 'Backend Dev',
        avatar: 'https://avatars.githubusercontent.com/u/31113941?v=4',
        linkedin: 'https://www.linkedin.com/in/bernard-ngandu/',
    },
]

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
                                        <img className="aspect-square rounded-full object-cover" src={member.avatar} alt={member.name} height="460" width="460" loading="lazy" />
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
                        <a href="mailto:contact@portaldoorcamento.pt" className="text-blue-500 hover:underline">
                            contact@portaldoorcamento.pt
                        </a>
                    </div>
                    
                    <p className="text-muted-foreground mb-4">Ou seguir-nos nas redes sociais:</p>
                    
                    <div className="flex gap-4">
                        <a 
                            href="https://twitter.com/portaldoorcamento" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-background hover:bg-gray-100 dark:hover:bg-gray-800 size-10 rounded-full flex items-center justify-center border transition-colors"
                            aria-label="Twitter"
                        >
                            <Twitter className="h-5 w-5" />
                        </a>
                        <a 
                            href="https://instagram.com/portaldoorcamento" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="bg-background hover:bg-gray-100 dark:hover:bg-gray-800 size-10 rounded-full flex items-center justify-center border transition-colors"
                            aria-label="Instagram"
                        >
                            <Instagram className="h-5 w-5" />
                        </a>
                        <a 
                            href="https://linkedin.com/company/portaldoorcamento" 
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