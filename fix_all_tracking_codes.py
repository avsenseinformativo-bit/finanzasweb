#!/usr/bin/env python3
"""
Script para corregir y añadir códigos de Google AdSense y Analytics
en todos los archivos HTML del sitio web.
"""

import os
import re

# Directorios a procesar
directories = [
    "/Users/alexvenelin/Desktop/adsense/AVFinanzas.com/public",
    "/Users/alexvenelin/Desktop/adsense/AVFinanzas.com/pages"
]

# Código correcto de Google AdSense
ADSENSE_CODE = '''<!-- Google AdSense -->
    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4245545296537847" crossorigin="anonymous"></script>
'''

# Código correcto de Google Analytics
ANALYTICS_CODE = '''<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-3FNCYG6XM1"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag() { dataLayer.push(arguments); }
        gtag('js', new Date());

        gtag('config', 'G-3FNCYG6XM1');
    </script>
'''

def fix_file(filepath):
    """
    Corrige un archivo HTML:
    1. Elimina códigos de AdSense y Analytics corruptos o existentes
    2. Añade los códigos correctos en el <head>
    """
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        original_content = content
        modified = False
        
        # 1. Eliminar cualquier código de AdSense existente (corrupto o no)
        # Buscar variantes del código AdSense
        adsense_patterns = [
            r'<!-- Google AdSense -->.*?</script>\s*',
            r'<script[^>]*pagead2\.googlesyndication\.com[^>]*>.*?</script>\s*',
        ]
        
        for pattern in adsense_patterns:
            if re.search(pattern, content, re.DOTALL):
                content = re.sub(pattern, '', content, flags=re.DOTALL)
                modified = True
        
        # 2. Eliminar cualquier código de Analytics corrupto (con \n literales)
        # Patrón para detectar el código corrupto con \n
        corrupt_analytics = r'<!-- Google tag \(gtag\.js\) -->n.*?</script>n'
        if re.search(corrupt_analytics, content, re.DOTALL):
            content = re.sub(corrupt_analytics, '', content, flags=re.DOTALL)
            modified = True
        
        # 2b. Eliminar fragmentos huérfanos de código corrupto (solo script con \n)
        orphan_corrupt = r'<script>\s*n\s*window\.dataLayer.*?</script>n'
        if re.search(orphan_corrupt, content, re.DOTALL):
            content = re.sub(orphan_corrupt, '', content, flags=re.DOTALL)
            modified = True
        
        # 3. Eliminar código de Analytics bien formado existente para reemplazarlo
        analytics_pattern = r'<!-- Google tag \(gtag\.js\) -->\s*<script[^>]*googletagmanager\.com/gtag/js[^>]*>.*?</script>\s*<script>.*?gtag\(.*?\);.*?</script>\s*'
        if re.search(analytics_pattern, content, re.DOTALL):
            content = re.sub(analytics_pattern, '', content, flags=re.DOTALL)
            modified = True
        
        # 4. Encontrar la etiqueta <head> y añadir los códigos correctos
        head_match = re.search(r'<head[^>]*>', content)
        if head_match:
            head_end_pos = head_match.end()
            
            # Construir el nuevo contenido con ambos códigos
            new_codes = '\n' + ADSENSE_CODE + '\n' + ANALYTICS_CODE
            
            # Insertar después de <head>
            content = content[:head_end_pos] + new_codes + content[head_end_pos:]
            modified = True
        
        # 5. Guardar solo si hubo cambios
        if modified or content != original_content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Actualizado: {os.path.basename(filepath)}")
            return True
        else:
            print(f"⏭️  Sin cambios: {os.path.basename(filepath)}")
            return False
    
    except Exception as e:
        print(f"❌ Error procesando {filepath}: {e}")
        return False

def main():
    """Procesa todos los archivos HTML en los directorios especificados"""
    count_fixed = 0
    count_total = 0
    
    print("🚀 Iniciando corrección de códigos de tracking...\n")
    
    for directory in directories:
        if not os.path.exists(directory):
            print(f"⚠️  Directorio no encontrado: {directory}")
            continue
        
        print(f"📁 Procesando: {directory}\n")
        
        for filename in sorted(os.listdir(directory)):
            if filename.endswith(".html"):
                filepath = os.path.join(directory, filename)
                count_total += 1
                if fix_file(filepath):
                    count_fixed += 1
    
    print(f"\n{'='*60}")
    print(f"✨ Proceso completado:")
    print(f"   - Total archivos procesados: {count_total}")
    print(f"   - Archivos actualizados: {count_fixed}")
    print(f"{'='*60}\n")

if __name__ == "__main__":
    main()
