import { motion } from "framer-motion";
import { Award, Leaf, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const products = [
  {
    name: "CUCA Original",
    description: "Nossa receita clássica, com sabor equilibrado e refrescante que conquistou Angola",
    alcohol: "5.0% álcool",
    image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  },
  {
    name: "CUCA Premium",
    description: "Edição especial com ingredientes selecionados para paladares exigentes",
    alcohol: "5.5% álcool",
    image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  },
  {
    name: "CUCA Light",
    description: "Versão leve com menos calorias, mantendo todo o sabor tradicional",
    alcohol: "3.5% álcool",
    image: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&h=400",
  },
];

const features = [
  {
    icon: Award,
    title: "Qualidade Premium",
    description: "Ingredientes selecionados e processo de fabricação rigoroso",
  },
  {
    icon: Leaf,
    title: "100% Natural",
    description: "Sem conservantes artificiais, apenas ingredientes naturais",
  },
  {
    icon: Heart,
    title: "Tradição Angolana",
    description: "Receita tradicional passada através de gerações",
  },
];

export default function ProductShowcase() {
  return (
    <section id="products" className="py-20 bg-cuca-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-montserrat font-bold text-4xl sm:text-5xl text-cuca-black mb-6">
            Nossos <span className="text-cuca-yellow">Produtos</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubra a linha completa de cervejas CUCA, cada uma com seu sabor
            único e qualidade excepcional
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {products.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300 group">
                <div
                  className="h-64 bg-cover bg-center"
                  style={{ backgroundImage: `url(${product.image})` }}
                />
                <CardContent className="p-6">
                  <h3 className="font-montserrat font-bold text-2xl text-cuca-black mb-3">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-cuca-yellow font-semibold">
                      {product.alcohol}
                    </span>
                    <Button className="bg-cuca-red text-white hover:bg-red-700 transition-colors">
                      Saiba Mais
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Additional Product Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="bg-cuca-yellow/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <feature.icon className="text-cuca-yellow h-8 w-8" />
              </div>
              <h4 className="font-montserrat font-semibold text-xl mb-2">
                {feature.title}
              </h4>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
