#!/bin/bash

# Script para agregar el código de AdSense a todos los archivos HTML
# que aún no lo tienen

ADSENSE_CODE='    <!-- Google AdSense -->\n    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4245545296537847" crossorigin="anonymous"></script>\n'

# Directorio public
PUBLIC_DIR="/Users/alexvenelin/Desktop/adsense/AVFinanzas.com/public"

# Buscar todos los archivos HTML en public (excepto index.html que ya está hecho)
find "$PUBLIC_DIR" -maxdepth 1 -name "*.html" ! -name "index.html" | while read -r file; do
    # Verificar si ya tiene el código de AdSense
    if grep -q "adsbygoogle.js" "$file"; then
        echo "✓ $file ya tiene AdSense"
    else
        # Buscar la línea con <head> y agregar el código después
        if grep -q "<head>" "$file"; then
            # Crear archivo temporal
            temp_file=$(mktemp)
            
            # Insertar el código después de <head>
            awk -v code="$ADSENSE_CODE" '
                /<head>/ {
                    print
                    print code
                    next
                }
                {print}
            ' "$file" > "$temp_file"
            
            # Reemplazar el archivo original
            mv "$temp_file" "$file"
            echo "✓ Agregado AdSense a: $(basename "$file")"
        else
            echo "✗ No se encontró <head> en: $(basename "$file")"
        fi
    fi
done

# Directorio pages
PAGES_DIR="/Users/alexvenelin/Desktop/adsense/AVFinanzas.com/pages"

find "$PAGES_DIR" -maxdepth 1 -name "*.html" | while read -r file; do
    # Verificar si ya tiene el código de AdSense
    if grep -q "adsbygoogle.js" "$file"; then
        echo "✓ $file ya tiene AdSense"
    else
        # Buscar la línea con <head> y agregar el código después
        if grep -q "<head>" "$file"; then
            # Crear archivo temporal
            temp_file=$(mktemp)
            
            # Insertar el código después de <head>
            awk -v code="$ADSENSE_CODE" '
                /<head>/ {
                    print
                    print code
                    next
                }
                {print}
            ' "$file" > "$temp_file"
            
            # Reemplazar el archivo original
            mv "$temp_file" "$file"
            echo "✓ Agregado AdSense a: $(basename "$file")"
        else
            echo "✗ No se encontró <head> en: $(basename "$file")"
        fi
    fi
done

echo ""
echo "✅ Proceso completado. Verifica los archivos."
