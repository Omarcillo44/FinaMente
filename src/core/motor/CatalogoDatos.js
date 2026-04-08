/*
* JSON para acceder al catálogo de gastos por personaje y categoría
* Los elementos pueden cambiar de valor, pero no pueden reasignarse,
* es decir, no pueden cambiar el nombre del atributo ni su tipo de contenido
*/

export const catalogoGastosDatos = {
  "DEPENDIENTE": [
    {
      "nombre": "Recarga Telcel",
      "categoria": "Recurrente",
      "monto": 200,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Spotify Premium",
      "categoria": "Recurrente",
      "monto": 219,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Pasajes de la semana",
      "categoria": "Básico",
      "monto": 135,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": false,
      "localizaciones": {
        "TRANSPORTE": { "modMonto": 1.0 },
        "ESCUELA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Comidas en cafetería",
      "categoria": "Básico",
      "monto": 135,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "ESCUELA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Copias y engargolados",
      "categoria": "Básico",
      "monto": 135,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "ESCUELA": { "modMonto": 1.0 },
        "SUPERMERCADO": { "modMonto": 0.9 }
      }
    },
    {
      "nombre": "Material escolar",
      "categoria": "Básico",
      "monto": 135,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "ESCUELA": { "modMonto": 1.0 },
        "SUPERMERCADO": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Pasajes de la semana",
      "categoria": "Básico",
      "monto": 250,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": false,
      "localizaciones": {
        "TRANSPORTE": { "modMonto": 1.0 },
        "ESCUELA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Comidas en cafetería",
      "categoria": "Básico",
      "monto": 300,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "ESCUELA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Copias y engargolados",
      "categoria": "Básico",
      "monto": 100,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "ESCUELA": { "modMonto": 1.0 },
        "SUPERMERCADO": { "modMonto": 0.9 }
      }
    },
    {
      "nombre": "Material escolar",
      "categoria": "Básico",
      "monto": 200,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "ESCUELA": { "modMonto": 1.0 },
        "SUPERMERCADO": { "modMonto": 0.9 }
      }
    },
    {
      "nombre": "Útiles escolares",
      "categoria": "Básico",
      "monto": 150,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "ESCUELA": { "modMonto": 1.0 },
        "SUPERMERCADO": { "modMonto": 0.9 }
      }
    },
    {
      "nombre": "Salida al cine",
      "categoria": "Gusto",
      "monto": 250,
      "esObligatorio": false,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Skin en videojuego",
      "categoria": "Gusto",
      "monto": 150,
      "esObligatorio": false,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Antojo Starbucks",
      "categoria": "Gusto",
      "monto": 120,
      "esObligatorio": false,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Camiseta nueva",
      "categoria": "Gusto",
      "monto": 300,
      "esObligatorio": false,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Salida por tacos",
      "categoria": "Gusto",
      "monto": 180,
      "esObligatorio": false,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Cable del celular roto",
      "categoria": "Sorpresa",
      "monto": 150,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 },
        "CENTRO_COMERCIAL": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Taxi por lluvia",
      "categoria": "Sorpresa",
      "monto": 120,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": false,
      "localizaciones": {
        "TRANSPORTE": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Cooperación imprevista",
      "categoria": "Sorpresa",
      "monto": 100,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": false,
      "localizaciones": {
        "ESCUELA": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Reposición de credencial",
      "categoria": "Sorpresa",
      "monto": 180,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "ESCUELA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Medicamento ligero",
      "categoria": "Sorpresa",
      "monto": 200,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CONSULTORIO": { "modMonto": 1.0 }
      }
    }
  ],
  "TRABAJADOR": [
    {
      "nombre": "Plan Celular",
      "categoria": "Recurrente",
      "monto": 399,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Internet de casa",
      "categoria": "Recurrente",
      "monto": 450,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Aporte fijo al hogar",
      "categoria": "Recurrente",
      "monto": 500,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Suscripción Gym",
      "categoria": "Recurrente",
      "monto": 400,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Transporte / Gasolina",
      "categoria": "Básico",
      "monto": 290,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "TRANSPORTE": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Despensa personal",
      "categoria": "Básico",
      "monto": 290,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "SUPERMERCADO": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Comidas cerca de oficina",
      "categoria": "Básico",
      "monto": 290,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Útiles y certificaciones",
      "categoria": "Básico",
      "monto": 290,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "ESCUELA": { "modMonto": 1.0 },
        "SUPERMERCADO": { "modMonto": 0.9 },
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Aporte extra de limpieza",
      "categoria": "Básico",
      "monto": 290,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Transporte / Gasolina",
      "categoria": "Básico",
      "monto": 450,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "TRANSPORTE": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Despensa personal",
      "categoria": "Básico",
      "monto": 600,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "SUPERMERCADO": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Comidas cerca de oficina",
      "categoria": "Básico",
      "monto": 550,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Útiles y certificaciones",
      "categoria": "Básico",
      "monto": 300,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "ESCUELA": { "modMonto": 1.0 },
        "SUPERMERCADO": { "modMonto": 0.9 },
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Aporte extra de limpieza",
      "categoria": "Básico",
      "monto": 250,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Ropa y calzado",
      "categoria": "Gusto",
      "monto": 800,
      "esObligatorio": false,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Salida de fin de semana",
      "categoria": "Gusto",
      "monto": 650,
      "esObligatorio": false,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Videojuego estreno",
      "categoria": "Gusto",
      "monto": 1200,
      "esObligatorio": false,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 },
        "CENTRO_COMERCIAL": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Cena restaurante",
      "categoria": "Gusto",
      "monto": 450,
      "esObligatorio": false,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Accesorio Tech",
      "categoria": "Gusto",
      "monto": 500,
      "esObligatorio": false,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Reparación de laptop",
      "categoria": "Sorpresa",
      "monto": 1200,
      "esObligatorio": true,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 },
        "CENTRO_COMERCIAL": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Consulta y receta",
      "categoria": "Sorpresa",
      "monto": 800,
      "esObligatorio": true,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CONSULTORIO": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Multa o trámite",
      "categoria": "Sorpresa",
      "monto": 600,
      "esObligatorio": true,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Regalo de cumpleaños",
      "categoria": "Sorpresa",
      "monto": 450,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Taxi de madrugada",
      "categoria": "Sorpresa",
      "monto": 250,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": false,
      "localizaciones": {
        "TRANSPORTE": { "modMonto": 1.0 }
      }
    }
  ],
  "INDEPENDIENTE": [
    {
      "nombre": "Renta de departamento",
      "categoria": "Recurrente",
      "monto": 2300,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Servicios (Agua, Luz, Gas)",
      "categoria": "Recurrente",
      "monto": 550,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Internet Alta Velocidad",
      "categoria": "Recurrente",
      "monto": 550,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Gym / Club Deportivo",
      "categoria": "Recurrente",
      "monto": 600,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Despensa quincenal",
      "categoria": "Básico",
      "monto": 350,
      "esObligatorio": true,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "SUPERMERCADO": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Transporte / Uber",
      "categoria": "Básico",
      "monto": 800,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "TRANSPORTE": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Artículos de limpieza",
      "categoria": "Básico",
      "monto": 350,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "SUPERMERCADO": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Comidas del trabajo",
      "categoria": "Básico",
      "monto": 700,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Higiene y cuidado personal",
      "categoria": "Básico",
      "monto": 450,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "SUPERMERCADO": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Boleto de Concierto",
      "categoria": "Gusto",
      "monto": 1500,
      "esObligatorio": false,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Ropa de marca",
      "categoria": "Gusto",
      "monto": 1200,
      "esObligatorio": false,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Cena en lugar exclusivo",
      "categoria": "Gusto",
      "monto": 900,
      "esObligatorio": false,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Viaje exprés",
      "categoria": "Gusto",
      "monto": 2200,
      "esObligatorio": false,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Electrodoméstico menor",
      "categoria": "Gusto",
      "monto": 850,
      "esObligatorio": false,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Emergencia dental",
      "categoria": "Sorpresa",
      "monto": 1800,
      "esObligatorio": true,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CONSULTORIO": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Reparación de coche/refri",
      "categoria": "Sorpresa",
      "monto": 1500,
      "esObligatorio": true,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 },
        "CENTRO_COMERCIAL": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Mantenimiento hogar",
      "categoria": "Sorpresa",
      "monto": 800,
      "esObligatorio": true,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Medicina especializada",
      "categoria": "Sorpresa",
      "monto": 950,
      "esObligatorio": true,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CONSULTORIO": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Seguro / Deducible menor",
      "categoria": "Sorpresa",
      "monto": 2500,
      "esObligatorio": true,
      "MSI": [1, 3, 6],
      "aceptaTDC": true,
      "localizaciones": {
        "CONSULTORIO": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    }
  ],
  "NINI": [
    {
      "nombre": "Recarga Básica",
      "categoria": "Recurrente",
      "monto": 100,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Spotify Estudiante",
      "categoria": "Recurrente",
      "monto": 69,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Suscripción económica",
      "categoria": "Recurrente",
      "monto": 50,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "iCloud / Drive",
      "categoria": "Recurrente",
      "monto": 20,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Membresía escolar",
      "categoria": "Recurrente",
      "monto": 80,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Pasajes en bus",
      "categoria": "Básico",
      "monto": 65,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": false,
      "localizaciones": {
        "TRANSPORTE": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Comida callejera",
      "categoria": "Básico",
      "monto": 120,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": false,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Útiles sueltos",
      "categoria": "Básico",
      "monto": 60,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "SUPERMERCADO": { "modMonto": 0.9 },
        "CENTRO_COMERCIAL": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Aporte simbólico casa",
      "categoria": "Básico",
      "monto": 200,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Higiene básica",
      "categoria": "Básico",
      "monto": 100,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "SUPERMERCADO": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Cine en promoción",
      "categoria": "Gusto",
      "monto": 100,
      "esObligatorio": false,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Antojo dulce",
      "categoria": "Gusto",
      "monto": 60,
      "esObligatorio": false,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Salida barata con amigos",
      "categoria": "Gusto",
      "monto": 150,
      "esObligatorio": false,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Ropa de segunda mano",
      "categoria": "Gusto",
      "monto": 180,
      "esObligatorio": false,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "RECAMARA": { "modMonto": 1.15 }
      }
    },
    {
      "nombre": "Juego indie en oferta",
      "categoria": "Gusto",
      "monto": 90,
      "esObligatorio": false,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "RECAMARA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Llanta de bici / Taxi",
      "categoria": "Sorpresa",
      "monto": 80,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": false,
      "localizaciones": {
        "TRANSPORTE": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Medicamento genérico",
      "categoria": "Sorpresa",
      "monto": 120,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CONSULTORIO": { "modMonto": 1.0 },
        "SUPERMERCADO": { "modMonto": 0.9 }
      }
    },
    {
      "nombre": "Reposición de llaves",
      "categoria": "Sorpresa",
      "monto": 100,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 },
        "CENTRO_COMERCIAL": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Cooperación urgente",
      "categoria": "Sorpresa",
      "monto": 70,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": false,
      "localizaciones": {
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    },
    {
      "nombre": "Reparación de zapatos",
      "categoria": "Sorpresa",
      "monto": 150,
      "esObligatorio": true,
      "MSI": [1],
      "aceptaTDC": true,
      "localizaciones": {
        "CENTRO_COMERCIAL": { "modMonto": 1.0 },
        "CASA_OFICINA": { "modMonto": 1.0 }
      }
    }
  ]
};

export class CatalogoGastos {
  static getGastosPorCategoria(perfilEnum, categoria) {
    const gastos = catalogoGastosDatos[perfilEnum];
    return gastos.filter(g => g.categoria === categoria);
  }
}
