import React, { useState, useEffect } from 'react';
import { Plus, Users, TrendingUp, Medal, Flame, Star } from 'lucide-react';

export default function SovietTrainingTracker() {
  const [comrades, setComrades] = useState([]);
  const [newComradeName, setNewComradeName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  // cargar datos del almacenamiento local al iniciar
  useEffect(() => {
    const savedComrades = JSON.parse(localStorage.getItem('sovietComrades') || '[]');
    setComrades(savedComrades);
  }, []);

  // guardar en almacenamiento local cada vez que cambien los camaradas
  useEffect(() => {
    localStorage.setItem('sovietComrades', JSON.stringify(comrades));
  }, [comrades]);

  const addComrade = () => {
    if (newComradeName.trim()) {
      const newComrade = {
        id: Date.now(),
        name: newComradeName.trim().toLowerCase(),
        count: 0,
        lastTraining: null,
        rank: getRank(0),
        streak: 0,
        achievements: []
      };
      setComrades([...comrades, newComrade]);
      setNewComradeName('');
      setShowAddForm(false);
    }
  };

   const getRank = (count) => {
    if (count >= 365) return { title: "Héroe del trabajo", icon: "🏆", color: "text-yellow-600" };
    if (count >= 300) return { title: "Stakhanovista", icon: "⭐", color: "text-yellow-500" };
    if (count >= 200) return { title: "Veterano de hierro", icon: "🛡️", color: "text-red-600" };
    if (count >= 100) return { title: "Guardián rojo", icon: "🔥", color: "text-red-500" };
    if (count >= 50) return { title: "Soldado disciplinado", icon: "🎖️", color: "text-blue-600" };
    if (count >= 25) return { title: "Camarada activo", icon: "💪", color: "text-blue-500" };
    if (count >= 10) return { title: "Recluta prometedor", icon: "🌟", color: "text-green-600" };
    return { title: "nuevo camarada", icon: "👤", color: "text-gray-500" };
  };

  const getMotivationalPhrase = (count) => {
    const phrases = [
      "¡La disciplina forja el carácter!",
      "Cada repetición es un paso hacia la grandeza",
      "El sudor de hoy es la victoria de mañana",
      "En la unión está la fuerza",
      "¡Por la gloria del colectivo!",
      "La perseverancia vence a la resistencia",
      "Entrenar es servir a la patria",
      "¡Adelante, camarada!"
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const incrementCount = (id) => {
    setComrades(comrades.map(comrade => {
      if (comrade.id === id) {
        const newCount = comrade.count + 1;
        const newRank = getRank(newCount);
        const oldRank = getRank(comrade.count);
        
        // detectar promoción de rango
        const wasPromoted = newRank.title !== oldRank.title;
        
        return {
          ...comrade,
          count: newCount,
          lastTraining: new Date().toLocaleDateString(),
          rank: newRank,
          wasPromoted: wasPromoted
        };
      }
      return comrade;
    }));
  };

  const removeComrade = (id) => {
    setComrades(comrades.filter(comrade => comrade.id !== id));
  };

  const totalTrainings = comrades.reduce((sum, comrade) => sum + comrade.count, 0);
  const averageTrainings = comrades.length > 0 ? (totalTrainings / comrades.length).toFixed(1) : 0;
  const yearProgress = totalTrainings > 0 ? Math.min((totalTrainings / (365 * comrades.length)) * 100, 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* header soviético */}
        <div className="text-center mb-8 relative">
          <div className="mb-4 text-6xl">☭</div>
          <h1 className="text-2xl md:text-3xl font-bold text-red-800 mb-2">
            Año Soviético Viking Box
          </h1>
          <p className="text-red-600 text-sm mb-4">
            "El trabajo duro forja campeones"
          </p>
          <div className="bg-red-600 text-white p-2 rounded text-sm">
            Progreso del colectivo: {yearProgress}% hacia la meta anual
          </div>
        </div>

        {/* estadísticas heroicas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border-2 border-red-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 bg-red-600 transform rotate-45 translate-x-4 -translate-y-4"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 uppercase tracking-wide font-bold">Camaradas</p>
                <p className="text-2xl font-bold text-gray-900">{comrades.length}</p>
              </div>
              <Users className="h-6 w-6 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border-2 border-red-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 bg-red-600 transform rotate-45 translate-x-4 -translate-y-4"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 uppercase tracking-wide font-bold">entrenamientos</p>
                <p className="text-2xl font-bold text-gray-900">{totalTrainings}</p>
              </div>
              <TrendingUp className="h-6 w-6 text-red-600" />
            </div>
          </div>
          
          <div className="bg-white p-4 rounded-lg border-2 border-red-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-8 h-8 bg-red-600 transform rotate-45 translate-x-4 -translate-y-4"></div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-red-600 uppercase tracking-wide font-bold">promedio</p>
                <p className="text-2xl font-bold text-gray-900">{averageTrainings}</p>
              </div>
              <Medal className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>

        {/* frase motivacional */}
        {comrades.length > 0 && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
            <p className="text-sm italic">"{getMotivationalPhrase()}"</p>
          </div>
        )}

        {/* botón agregar camarada */}
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full mb-6 p-4 bg-white border-2 border-dashed border-red-300 rounded-lg text-red-600 hover:border-red-400 hover:text-red-700 hover:bg-red-50 transition-colors flex items-center justify-center gap-2 font-medium"
          >
            <Plus className="h-5 w-5" />
            Reclutar nuevo camarada
          </button>
        )}

        {/* formulario agregar camarada */}
        {showAddForm && (
          <div className="bg-white p-4 rounded-lg border-2 border-red-200 mb-6">
            <h3 className="text-red-800 font-bold mb-3">registro de nuevo camarada</h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={newComradeName}
                onChange={(e) => setNewComradeName(e.target.value)}
                placeholder="Nombre del valiente camarada"
                className="flex-1 px-3 py-2 border-2 border-red-300 rounded text-sm focus:outline-none focus:border-red-500"
                onKeyPress={(e) => e.key === 'Enter' && addComrade()}
                autoFocus
              />
              <div className="flex gap-2">
                <button
                  onClick={addComrade}
                  className="px-4 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors font-medium"
                >
                  Alistar
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewComradeName('');
                  }}
                  className="px-4 py-2 border-2 border-red-300 rounded text-sm hover:bg-red-50 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* lista de camaradas */}
        <div className="space-y-4">
          {comrades.length === 0 ? (
            <div className="text-center py-12 text-red-600">
              <div className="text-4xl mb-4">🏭</div>
              <p className="text-sm font-medium">el cuartel está vacío</p>
              <p className="text-xs mt-1">Recluta tu primer camarada para comenzar la revolución del fitness</p>
            </div>
          ) : (
            comrades
              .sort((a, b) => b.count - a.count)
              .map((comrade, index) => (
                <div
                  key={comrade.id}
                  className={`bg-white p-4 rounded-lg border-2 transition-all duration-300 ${
                    comrade.wasPromoted 
                      ? 'border-yellow-400 bg-yellow-50 shadow-lg' 
                      : index === 0 
                        ? 'border-red-400 bg-red-50' 
                        : 'border-red-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{comrade.rank.icon}</span>
                        <h3 className="font-bold text-gray-900">{comrade.name}</h3>
                        {index === 0 && <div className="text-yellow-500">👑</div>}
                        {comrade.wasPromoted && (
                          <div className="animate-pulse text-yellow-500">🎖️ ¡PROMOCIÓN!</div>
                        )}
                      </div>
                      
                      <div className={`text-sm font-medium mb-1 ${comrade.rank.color}`}>
                        {comrade.rank.title}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">
                          {comrade.count} {comrade.count === 1 ? 'entrenamiento' : 'entrenamientos'}
                        </span>
                        {comrade.lastTraining && (
                          <span className="text-xs">
                            último: {comrade.lastTraining}
                          </span>
                        )}
                      </div>

                      {/* barra de progreso hacia siguiente rango */}
                      <div className="mt-2">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${Math.min((comrade.count % 25) / 25 * 100, 100)}%`
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {25 - (comrade.count % 25)} Entrenamientos para siguiente rango
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-3xl font-bold text-red-600">
                          {comrade.count}
                        </div>
                      </div>
                      
                      <button
                        onClick={() => incrementCount(comrade.id)}
                        className="h-16 w-16 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-200 text-xl font-bold shadow-lg hover:shadow-xl transform hover:scale-105"
                      >
                        +1
                      </button>
                      
                      <button
                        onClick={() => removeComrade(comrade.id)}
                        className="ml-2 text-gray-400 hover:text-red-500 transition-colors text-lg"
                        title="Dar de baja"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                </div>
              ))
          )}
        </div>

        {/* footer heroico */}
        {comrades.length > 0 && (
          <div className="text-center mt-12 pt-8 border-t-2 border-red-200">
            <div className="text-2xl mb-2">⚡</div>
            <p className="text-sm text-red-600 font-medium">
              "La disciplina es la madre de la victoria"
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Año soviético en progreso · ¡gloria al trabajo duro!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}