import os
import re

# Directorios a procesar
directories = [
    "/Users/alexvenelin/Desktop/adsense/AVFinanzas.com/public",
    "/Users/alexvenelin/Desktop/adsense/AVFinanzas.com/pages"
]

# Patrón corrupto (aproximado para coincidir con variaciones de espacios)
# Busca el inicio del tag corrupto y el final
corrupt_pattern = re.compile(
    r'<!-- Google tag \(gtag\.js\) -->n\s*<script async src="https://www\.googletagmanager\.com/gtag/js\?id=([^"]+)"></script>n\s*<script>n\s*window\.dataLayer = window\.dataLayer \|\| \[\];n\s*function gtag\(\)\{dataLayer\.push\(arguments\);\}n\s*gtag\(\'js\', new Date\(\)\);nn\s*gtag\(\'config\', \'\1\'\);n\s*</script>n'
)

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Verificar si tiene el patrón corrupto
        match = corrupt_pattern.search(content)
        if match:
            tracking_id = match.group(1)
            print(f"Encontrado patrón corrupto en: {os.path.basename(filepath)} (ID: {tracking_id})")
            
            # Bloque correcto
            correct_block = f"""<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id={tracking_id}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){{dataLayer.push(arguments);}}
        gtag('js', new Date());

        gtag('config', '{tracking_id}');
    </script>"""
            
            # Reemplazar
            new_content = corrupt_pattern.sub(correct_block, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"✅ Reparado: {os.path.basename(filepath)}")
            return True
        else:
            # Intentar búsqueda más laxa si la exacta falla pero parece corrupto
            if "<!-- Google tag (gtag.js) -->n" in content:
                print(f"⚠️ Posible corrupción no coincidente en: {os.path.basename(filepath)}")
                # Intentar arreglo manual simple para este caso específico si es común
                simple_corrupt = "<!-- Google tag (gtag.js) -->n"
                if simple_corrupt in content:
                     # Esto es arriesgado sin regex completo, mejor reportar
                     pass
            return False

    except Exception as e:
        print(f"Error procesando {filepath}: {e}")
        return False

count = 0
for directory in directories:
    if os.path.exists(directory):
        for filename in os.listdir(directory):
            if filename.endswith(".html"):
                filepath = os.path.join(directory, filename)
                if fix_file(filepath):
                    count += 1

print(f"\nTotal archivos reparados: {count}")
