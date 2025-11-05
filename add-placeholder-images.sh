#!/bin/bash

# Script para adicionar placeholders de imagens no site Toldo Vela
# Usa Unsplash Source API para imagens temporárias

echo "🖼️  Adicionando placeholders de imagens..."

cd /Users/yourapple/TOLDOVELA/site

# Criar estrutura de pastas
echo "📁 Criando estrutura de pastas..."
mkdir -p assets/images/{logos,hero,solutions,portfolio/{residencial,comercial,corporativo,esportivo},materials,certifications,blog,team,misc}

# Baixar algumas imagens de exemplo do Unsplash
echo "📥 Baixando imagens de exemplo (Unsplash)..."

# Hero images
curl -L "https://source.unsplash.com/1920x800/?architecture,modern,building" -o assets/images/hero/home-hero.jpg
curl -L "https://source.unsplash.com/1920x800/?outdoor,structure,shade" -o assets/images/solutions/toldos-vela-hero.jpg
curl -L "https://source.unsplash.com/1920x800/?facade,building,modern" -o assets/images/solutions/fachadas-hero.jpg
curl -L "https://source.unsplash.com/1920x800/?architecture,minimal" -o assets/images/solutions/brises-hero.jpg
curl -L "https://source.unsplash.com/1920x800/?pergola,outdoor,luxury" -o assets/images/solutions/pergolas-hero.jpg

# Portfolio - Residencial
curl -L "https://source.unsplash.com/1200x800/?pool,luxury,home" -o assets/images/portfolio/residencial/projeto-01.jpg
curl -L "https://source.unsplash.com/1200x800/?backyard,modern,pool" -o assets/images/portfolio/residencial/projeto-02.jpg
curl -L "https://source.unsplash.com/1200x800/?terrace,outdoor,luxury" -o assets/images/portfolio/residencial/projeto-03.jpg
curl -L "https://source.unsplash.com/1200x800/?garden,modern,house" -o assets/images/portfolio/residencial/projeto-04.jpg

# Portfolio - Comercial
curl -L "https://source.unsplash.com/1200x800/?restaurant,outdoor,terrace" -o assets/images/portfolio/comercial/projeto-01.jpg
curl -L "https://source.unsplash.com/1200x800/?cafe,outdoor,seating" -o assets/images/portfolio/comercial/projeto-02.jpg
curl -L "https://source.unsplash.com/1200x800/?hotel,outdoor,pool" -o assets/images/portfolio/comercial/projeto-03.jpg
curl -L "https://source.unsplash.com/1200x800/?resort,luxury,outdoor" -o assets/images/portfolio/comercial/projeto-04.jpg

# Portfolio - Corporativo
curl -L "https://source.unsplash.com/1200x800/?office,building,modern" -o assets/images/portfolio/corporativo/projeto-01.jpg
curl -L "https://source.unsplash.com/1200x800/?corporate,architecture,modern" -o assets/images/portfolio/corporativo/projeto-02.jpg
curl -L "https://source.unsplash.com/1200x800/?business,outdoor,modern" -o assets/images/portfolio/corporativo/projeto-03.jpg

# Portfolio - Esportivo
curl -L "https://source.unsplash.com/1200x800/?sports,facility,outdoor" -o assets/images/portfolio/esportivo/projeto-01.jpg
curl -L "https://source.unsplash.com/1200x800/?stadium,modern,architecture" -o assets/images/portfolio/esportivo/projeto-02.jpg
curl -L "https://source.unsplash.com/1200x800/?playground,outdoor,shade" -o assets/images/portfolio/esportivo/projeto-03.jpg

# Blog images
curl -L "https://source.unsplash.com/1200x600/?architecture,innovation" -o assets/images/blog/featured-post.jpg
for i in {1..12}; do
  curl -L "https://source.unsplash.com/800x500/?architecture,design,modern" -o "assets/images/blog/post-0$i.jpg"
  sleep 1 # Para evitar rate limit
done

# Materials
curl -L "https://source.unsplash.com/1200x800/?fabric,textile,material" -o assets/images/materials/gale-pacific-hdpe.jpg
curl -L "https://source.unsplash.com/1200x800/?material,texture,white" -o assets/images/materials/serge-ferrari-pvc.jpg
curl -L "https://source.unsplash.com/1200x800/?fabric,white,clean" -o assets/images/materials/gore-tenara-ptfe.jpg

# Team
curl -L "https://source.unsplash.com/1200x800/?team,office,business" -o assets/images/team/equipe-completa.jpg
curl -L "https://source.unsplash.com/1200x800/?office,workspace,modern" -o assets/images/team/escritorio.jpg

# OG Image
curl -L "https://source.unsplash.com/1200x630/?architecture,modern,building" -o assets/images/misc/og-image.jpg

echo "✅ Download de imagens concluído!"
echo ""
echo "📝 Próximos passos:"
echo "   1. Substituir logos (SVG) em assets/images/logos/"
echo "   2. Adicionar favicon em assets/images/misc/"
echo "   3. Substituir gradualmente por fotos reais"
echo ""
echo "🎯 Total de imagens baixadas: ~35"
echo "📍 Localização: /Users/yourapple/TOLDOVELA/site/assets/images/"
