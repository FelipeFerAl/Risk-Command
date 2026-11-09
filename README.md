# RISK COMMAND v1.2.1

Gamificador académico para **Gestión del Riesgo**, basado en React + Vite.

## Qué incorpora v1.2

- Registro de estudiantes.
- Inicio de sesión.
- Nombre, apellido, código de estudiante y grupo.
- XP y progreso individual.
- Misiones avanzadas de RISK COMMAND v1.1.
- Registro centralizado de intentos y mejores puntajes.
- Tabla de clasificación general por XP.
- Rango automático según XP.
- Cálculo de XP en servidor mediante Supabase RPC.
- Modo local de respaldo para probar la interfaz sin configurar la base de datos.
- Sin panel docente en esta versión.

## Arquitectura

```text
React + Vite
     │
     ├── Modo local (si no hay variables VITE_SUPABASE_*)
     │
     └── Supabase
          ├── Authentication
          ├── PostgreSQL
          ├── profiles
          ├── missions
          ├── mission_attempts
          └── RPCs de XP y clasificación
```

## Configuración de Supabase

1. Crea un proyecto en Supabase.
2. Abre **SQL Editor**.
3. Ejecuta completamente `supabase/schema.sql`.
4. En **Authentication > Providers > Email**, para un prototipo de aula puedes desactivar la confirmación de correo si quieres acceso inmediato después del registro.
5. Copia `.env.example` como `.env`.
6. Completa:

```env
VITE_SUPABASE_URL=TU_URL_DE_SUPABASE
VITE_SUPABASE_ANON_KEY=TU_CLAVE_ANON_PUBLICA
```

La clave `anon`/publishable es la apropiada para el frontend cuando las políticas RLS están correctamente configuradas. No coloques una `service_role` en `.env` del navegador.

## Ejecución

```bash
npm install
npm run dev
```

Después abre la URL que muestre Vite, normalmente:

```text
http://localhost:5173
```

## Prueba sin Supabase

Si `.env` está vacío o no existe, RISK COMMAND funciona en **modo local** usando `localStorage`. Esto permite probar:

- registro de estudiantes,
- inicio de sesión local,
- misiones,
- XP,
- mejores puntajes,
- clasificación dentro del navegador.

El modo local no es una base de datos multiusuario real. Para compartir puntajes entre computadores o navegadores, configura Supabase.

## Datos académicos

Los escenarios avanzados contienen datos numéricos simulados con fines académicos. No representan mediciones oficiales de una zona real.

## Evolución prevista

- **v1.3:** misiones más interactivas y mayor variedad de decisiones.
- **v2.0:** equipos y competencias.
- **v2.1:** eventos en tiempo real.
- **v3.0:** simulador integral de gestión del riesgo.


## Registro simplificado v1.2.1

El estudiante solo proporciona:
- Nombre
- Apellido
- Contraseña

No se solicita código, correo ni grupo. Para Supabase Auth, la aplicación genera
internamente un correo técnico a partir del nombre y apellido. Este correo no se
muestra en la interfaz.

> Por ahora no se controla la repetición de nombres. Para un uso masivo posterior
> convendrá migrar a un identificador de acceso independiente.

## Publicación en Internet

Para usar RISK COMMAND desde computadores fuera de la red local:
1. Crear un proyecto en Supabase.
2. Ejecutar `supabase/schema.sql`.
3. Desactivar la confirmación de correo en Authentication > Providers > Email.
4. Configurar `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
5. Publicar el frontend en Vercel, Netlify o un hosting equivalente.
6. Probar desde una red móvil u otra conexión diferente a la del servidor local.

No es necesario abrir puertos del router ni mantener el computador de desarrollo
encendido una vez publicado el frontend.
