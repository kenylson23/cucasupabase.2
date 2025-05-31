import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const contactInfo = [
  {
    icon: MapPin,
    title: "Sede Principal",
    content: "Rua da Cervejaria, 123\nLuanda, Angola",
  },
  {
    icon: Phone,
    title: "Telefone",
    content: "+244 222 123 456",
  },
  {
    icon: Mail,
    title: "Email",
    content: "contato@cuca.ao",
  },
  {
    icon: Clock,
    title: "Horário de Atendimento",
    content: "Segunda a Sexta: 8h às 18h\nSábado: 8h às 14h",
  },
];

const socialLinks = [
  { icon: Facebook, href: "#", color: "hover:bg-cuca-red" },
  { icon: Instagram, href: "#", color: "hover:bg-cuca-red" },
  { icon: Twitter, href: "#", color: "hover:bg-cuca-red" },
  { icon: Youtube, href: "#", color: "hover:bg-cuca-red" },
];

export default function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await apiRequest("POST", "/api/contact", formData);
      toast({
        title: "Mensagem enviada!",
        description: "Obrigado pela sua mensagem! Entraremos em contato em breve.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Erro ao enviar mensagem",
        description: "Ocorreu um erro ao enviar sua mensagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section id="contact" className="py-20 bg-cuca-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-montserrat font-bold text-4xl sm:text-5xl text-cuca-black mb-6">
            <span className="text-cuca-red">Contato</span> & Localização
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Estamos sempre prontos para atender você. Entre em contato conosco
            ou visite uma de nossas lojas
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="font-montserrat font-semibold text-2xl text-cuca-black mb-8">
              Informações de Contato
            </h3>

            <div className="space-y-6">
              {contactInfo.map((info, index) => (
                <div key={info.title} className="flex items-start">
                  <div className="bg-cuca-yellow/20 w-12 h-12 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    <info.icon className="text-cuca-yellow h-6 w-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-cuca-black mb-1">
                      {info.title}
                    </h4>
                    <p className="text-gray-600 whitespace-pre-line">
                      {info.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social Media */}
            <div className="mt-8">
              <h4 className="font-montserrat font-semibold text-xl text-cuca-black mb-4">
                Siga-nos
              </h4>
              <div className="flex space-x-4">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    className={`bg-cuca-yellow text-cuca-black w-12 h-12 rounded-lg flex items-center justify-center ${social.color} hover:text-white transition-colors`}
                  >
                    <social.icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h3 className="font-montserrat font-semibold text-2xl text-cuca-black mb-8">
              Envie uma Mensagem
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-cuca-black mb-2">
                    Nome
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    required
                    className="focus:ring-2 focus:ring-cuca-yellow focus:border-transparent"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-cuca-black mb-2">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    required
                    className="focus:ring-2 focus:ring-cuca-yellow focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="subject" className="block text-sm font-medium text-cuca-black mb-2">
                  Assunto
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Assunto da mensagem"
                  required
                  className="focus:ring-2 focus:ring-cuca-yellow focus:border-transparent"
                />
              </div>

              <div>
                <Label htmlFor="message" className="block text-sm font-medium text-cuca-black mb-2">
                  Mensagem
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Sua mensagem..."
                  required
                  className="focus:ring-2 focus:ring-cuca-yellow focus:border-transparent"
                />
              </div>

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-cuca-red hover:bg-red-700 text-white font-montserrat font-semibold py-4 transition-colors duration-300 transform hover:scale-105"
              >
                {isSubmitting ? "Enviando..." : "Enviar Mensagem"}
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
