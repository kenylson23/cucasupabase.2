import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Camera, Upload, Heart, Star } from "lucide-react";
import type { FanPhoto, InsertFanPhoto } from "@shared/schema";

export default function GaleriaFas() {
  const [formData, setFormData] = useState({
    name: "",
    caption: "",
    imageData: ""
  });
  const [imagePreview, setImagePreview] = useState<string>("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Buscar fotos aprovadas
  const { data: approvedPhotos = [], isLoading } = useQuery<FanPhoto[]>({
    queryKey: ["/api/fan-gallery"],
  });

  // Mutation para enviar nova foto
  const submitPhotoMutation = useMutation({
    mutationFn: async (photoData: InsertFanPhoto) => {
      return apiRequest("/api/fan-gallery", "POST", photoData);
    },
    onSuccess: () => {
      toast({
        title: "Foto enviada com sucesso!",
        description: "Sua foto está aguardando aprovação. Em breve aparecerá na galeria!",
      });
      setFormData({ name: "", caption: "", imageData: "" });
      setImagePreview("");
      queryClient.invalidateQueries({ queryKey: ["/api/fan-gallery"] });
    },
    onError: (error) => {
      toast({
        title: "Erro ao enviar foto",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "A imagem deve ter no máximo 5MB.",
          variant: "destructive",
        });
        return;
      }

      // Verificar tipo
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Formato inválido",
          description: "Apenas imagens são permitidas.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const base64String = e.target?.result as string;
        setFormData(prev => ({ ...prev, imageData: base64String }));
        setImagePreview(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.caption.trim() || !formData.imageData) {
      toast({
        title: "Campos obrigatórios",
        description: "Preencha todos os campos e selecione uma imagem.",
        variant: "destructive",
      });
      return;
    }

    submitPhotoMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-amber-800 dark:text-amber-200 mb-4">
            Galeria dos Fãs da CUCA
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Compartilhe seus momentos especiais com a CUCA! Envie sua foto e faça parte da nossa galeria.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário de envio */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Envie sua foto
              </CardTitle>
              <CardDescription>
                Compartilhe seu momento CUCA conosco
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Seu nome</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Digite seu nome"
                    maxLength={255}
                  />
                </div>

                <div>
                  <Label htmlFor="caption">Legenda da foto</Label>
                  <Textarea
                    id="caption"
                    value={formData.caption}
                    onChange={(e) => setFormData(prev => ({ ...prev, caption: e.target.value }))}
                    placeholder="Conte-nos sobre este momento especial..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Escolha sua foto</Label>
                  <div className="mt-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('image')?.click()}
                      className="w-full h-32 border-dashed border-2 hover:border-amber-400"
                    >
                      <div className="text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                        <p>Clique para escolher uma foto</p>
                        <p className="text-sm text-gray-500">Máximo 5MB</p>
                      </div>
                    </Button>
                  </div>
                </div>

                {imagePreview && (
                  <div className="mt-4">
                    <Label>Pré-visualização</Label>
                    <div className="mt-2 border rounded-lg overflow-hidden">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-48 object-cover"
                      />
                    </div>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700"
                  disabled={submitPhotoMutation.isPending}
                >
                  {submitPhotoMutation.isPending ? "Enviando..." : "Enviar foto"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Galeria de fotos aprovadas */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5" />
                  Fotos dos nossos fãs
                </CardTitle>
                <CardDescription>
                  Momentos especiais compartilhados pelos fãs da CUCA
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="grid grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                    ))}
                  </div>
                ) : approvedPhotos.length > 0 ? (
                  <div className="grid grid-cols-2 gap-4 max-h-96 overflow-y-auto">
                    {approvedPhotos.map((photo) => (
                      <div key={photo.id} className="group relative">
                        <img
                          src={photo.imageData}
                          alt={photo.caption}
                          className="w-full aspect-square object-cover rounded-lg transition-transform group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-end">
                          <div className="p-3 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                            <p className="font-semibold text-sm">{photo.name}</p>
                            <p className="text-xs">{photo.caption}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500">Ainda não há fotos na galeria.</p>
                    <p className="text-sm text-gray-400">Seja o primeiro a compartilhar!</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}