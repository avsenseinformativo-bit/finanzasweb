#!/bin/bash

# Script para añadir Google Analytics a todas las páginas HTML

ANALYTICS_CODE='    <!-- Google tag (gtag.js) -->\n    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3FNCYG6XM1"></script>\n    <script>\n      window.dataLayer = window.dataLayer || [];\n      function gtag(){dataLayer.push(arguments);}\n      gtag('\''js'\'', new Date());\n\n      gtag('\''config'\'', '\''G-3FNCYG6XM1'\'');\n    </script>\n'

# Buscar todos los archivos HTML excepto index.html (ya lo hicimos)
find . -name "*.html" -type f ! -name "index.html" | while read file; do
    # Verificar si ya tiene Google Analytics
    if grep -q "gtag.js" "$file"; then
        echo "✓ $file ya tiene Analytics"
    else
        # Buscar la línea con </head> y añadir el código antes
        if grep -q "</head>" "$file"; then
            # Usar sed para insertar antes de </head>
            sed -i '' "/<\/head>/i\\
$ANALYTICS_CODE
" "$file"
            echo "✓ Analytics añadido a $file"
        else
            echo "✗ No se encontró </head> en $file"
        fi
    fi
done

echo ""
echo "✅ Google Analytics instalado en todas las páginas"
