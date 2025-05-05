import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Stadistic = () => {
  const [estadisticas, setEstadisticas] = useState({ porDia: 0, porSemana: 0, porMes: 0 });

  const obtenerToken = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/oauth/token', {
        grant_type: 'client_credentials',
        client_id: '9ecb8739-f6c0-48a6-9b70-b557e1926b4f',
        client_secret: 'ZPbBvhNXihrnFySWY4lO3G6B1WfiRTo1Fq7JxZp8',
        scope: '*'
      });
      return response.data.access_token;
    } catch (error) {
      console.error('Error al obtener el token:', error);
      return null;
    }
  };

  useEffect(() => {
    const cargarDatos = async () => {
      const token = await obtenerToken();
      if (!token) return;

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/students', {
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = response.data;
        const now = new Date();

        let porDia = 0;
        let porSemana = 0;
        let porMes = 0;

        data.forEach(est => {
          const fecha = new Date(est.created_at);
          const diferencia = (now - fecha) / (1000 * 60 * 60 * 24);

          if (diferencia <= 1) porDia++;
          if (diferencia <= 7) porSemana++;
          if (diferencia <= 30) porMes++;
        });

        setEstadisticas({ porDia, porSemana, porMes });
      } catch (error) {
        console.error('Error al obtener estudiantes:', error);
      }
    };

    cargarDatos();
  }, []);

  return (
    <div className="flex items-center justify-center w-screen min-h-screen text-gray-800 p-10 bg-gray-200">
      <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-6 w-full max-w-6xl">

        <div className="flex items-center p-4 bg-white rounded">
          <div className="flex flex-shrink-0 items-center justify-center bg-green-200 h-16 w-16 rounded">
            <svg className="w-6 h-6 fill-current text-green-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <span className="text-xl font-bold">{estadisticas.porDia}</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Registrados hoy</span>
            </div>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded">
          <div className="flex flex-shrink-0 items-center justify-center bg-yellow-200 h-16 w-16 rounded">
            <svg className="w-6 h-6 fill-current text-yellow-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <span className="text-xl font-bold">{estadisticas.porSemana}</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Registrados últimos 7 días</span>
            </div>
          </div>
        </div>

        <div className="flex items-center p-4 bg-white rounded">
          <div className="flex flex-shrink-0 items-center justify-center bg-blue-200 h-16 w-16 rounded">
            <svg className="w-6 h-6 fill-current text-blue-700" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="flex-grow flex flex-col ml-4">
            <span className="text-xl font-bold">{estadisticas.porMes}</span>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Registrados últimos 30 días</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Stadistic;