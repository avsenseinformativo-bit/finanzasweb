import os

# Directorios a procesar
directories = [
    "/Users/alexvenelin/Desktop/adsense/AVFinanzas.com/public",
    "/Users/alexvenelin/Desktop/adsense/AVFinanzas.com/pages"
]

# Cadena corrupta exacta (basada en la observación)
corrupt_string_start = "<!-- Google tag (gtag.js) -->n"
corrupt_string_end = "</script>n"

def fix_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        if corrupt_string_start in content:
            print(f"Detectado posible error en: {os.path.basename(filepath)}")
            
            # Intentar encontrar el bloque completo corrupto
            # Asumimos que empieza con el comentario y termina con </script>n
            # y contiene "gtag"
            
            start_idx = content.find(corrupt_string_start)
            if start_idx != -1:
                # Buscar el final del script tag
                end_idx = content.find(corrupt_string_end, start_idx)
                if end_idx != -1:
                    full_corrupt_block = content[start_idx:end_idx + len(corrupt_string_end)]
                    
                    # Extraer ID si es posible, sino usar el conocido
                    tracking_id = "G-3FNCYG6XM1"
                    if "id=" in full_corrupt_block:
                        try:
                            id_part = full_corrupt_block.split("id=")[1].split('"')[0]
                            if id_part.startswith("G-"):
                                tracking_id = id_part
                        except:
                            pass
                    
                    correct_block = f"""<!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id={tracking_id}"></script>
    <script>
        window.dataLayer = window.dataLayer || [];
        function gtag(){{dataLayer.push(arguments);}}
        gtag('js', new Date());

        gtag('config', '{tracking_id}');
    </script>"""
                    
                    new_content = content.replace(full_corrupt_block, correct_block)
                    
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    print(f"✅ Reparado: {os.path.basename(filepath)}")
                    return True
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
