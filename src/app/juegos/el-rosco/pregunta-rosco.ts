export interface PreguntaRosco {
  letra: string;

  tipo: 'empieza' | 'contiene';

  pregunta: string;

  respuesta: string;

  estado: 'actual' |'pendiente'|'correcta'|'incorrecta' | 'pasada';

}
