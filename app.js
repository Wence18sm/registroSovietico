function SovietTrainingTracker() {
  const [comrades, setComrades] = React.useState([]);
  const [newComradeName, setNewComradeName] = React.useState('');
  const [showAddForm, setShowAddForm] = React.useState(false);

  // cargar datos
  React.useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('sovietComrades') || '[]');
    setComrades(saved);
  }, []);

  // guardar datos
  React.useEffect(() => {
    localStorage.setItem('sovietComrades', JSON.stringify(comrades));
  }, [comrades]);

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

  const getMotivationalPhrase = () => {
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

  const addComrade = () => {
    if (newComradeName.trim()) {
      const newComrade = {
        id: Date.now(),
        name: newComradeName.trim().toLowerCase(),
        count: 0,
        lastTraining: null,
        rank: getRank(0),
        wasPromoted: false,
      };
      setComrades([...comrades, newComrade]);
      setNewComradeName('');
      setShowAddForm(false);
    }
  };

  const incrementCount = (id) => {
    setComrades(comrades.map(c => {
      if (c.id === id) {
        const newCount = c.count + 1;
        const newRank = getRank(newCount);
        return {
          ...c,
          count: newCount,
          lastTraining: new Date().toLocaleDateString(),
          rank: newRank,
          wasPromoted: newRank.title !== c.rank.title
        };
      }
      return c;
    }));
  };

  const removeComrade = (id) => {
    setComrades(comrades.filter(c => c.id !== id));
  };

  const totalTrainings = comrades.reduce((s, c) => s + c.count, 0);
  const averageTrainings = comrades.length > 0 ? (totalTrainings / comrades.length).toFixed(1) : 0;
  const yearProgress = totalTrainings > 0 ? Math.min((totalTrainings / (365 * comrades.length)) * 100, 100).toFixed(1) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 p-4 md:p-6">
      <div className="max-w-2xl mx-auto">
        {/* header */}
        <div className="text-center mb-8 relative">
          <div className="mb-4 text-6xl">☭</div>
          <h1 className="text-2xl md:text-3xl font-bold text-red-800 mb-2">Año Soviético Viking Box</h1>
          <p className="text-red-600 text-sm mb-4">"El trabajo duro forja campeones"</p>
          <div className="bg-red-600 text-white p-2 rounded text-sm">
            Progreso del colectivo: {yearProgress}% hacia la meta anual
          </div>
        </div>

        {/* estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg border-2 border-red-200">
            <p className="text-xs text-red-600 uppercase font-bold">Camaradas</p>
            <p className="text-2xl font-bold">{comrades.length}</p>
            <i data-lucide="users" class="h-6 w-6 text-red-600"></i>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-red-200">
            <p className="text-xs text-red-600 uppercase font-bold">Entrenamientos</p>
            <p className="text-2xl font-bold">{totalTrainings}</p>
            <i data-lucide="trending-up" class="h-6 w-6 text-red-600"></i>
          </div>
          <div className="bg-white p-4 rounded-lg border-2 border-red-200">
            <p className="text-xs text-red-600 uppercase font-bold">Promedio</p>
            <p className="text-2xl font-bold">{averageTrainings}</p>
            <i data-lucide="medal" class="h-6 w-6 text-red-600"></i>
          </div>
        </div>

        {/* frase motivacional */}
        {comrades.length > 0 && (
          <div className="bg-red-600 text-white p-4 rounded-lg mb-6 text-center">
            <p className="text-sm italic">"{getMotivationalPhrase()}"</p>
          </div>
        )}

        {/* botón agregar */}
        {!showAddForm && (
          <button onClick={() => setShowAddForm(true)}
            className="w-full mb-6 p-4 bg-white border-2 border-dashed border-red-300 rounded-lg text-red-600">
            <i data-lucide="plus" class="h-5 w-5"></i>
            Reclutar nuevo camarada
          </button>
        )}

        {/* formulario */}
        {showAddForm && (
          <div className="bg-white p-4 rounded-lg border-2 border-red-200 mb-6">
            <h3 className="text-red-800 font-bold mb-3">Registro de nuevo camarada</h3>
            <div className="flex gap-2">
              <input value={newComradeName} onChange={(e) => setNewComradeName(e.target.value)}
                placeholder="Nombre del camarada"
                className="flex-1 px-3 py-2 border-2 border-red-300 rounded text-sm" />
              <button onClick={addComrade} className="px-4 py-2 bg-red-600 text-white rounded">Alistar</button>
              <button onClick={() => { setShowAddForm(false); setNewComradeName(''); }}
                className="px-4 py-2 border-2 border-red-300 rounded">Cancelar</button>
            </div>
          </div>
        )}

        {/* lista */}
        <div className="space-y-4">
          {comrades.length === 0 ? (
            <div className="text-center py-12 text-red-600">
              <div className="text-4xl mb-4">🏭</div>
              <p className="text-sm font-medium">El cuartel está vacío</p>
              <p className="text-xs">Recluta tu primer camarada</p>
            </div>
          ) : (
            comrades.sort((a, b) => b.count - a.count).map((c, i) => (
              <div key={c.id}
                className={`bg-white p-4 rounded-lg border-2 ${
                  c.wasPromoted ? 'border-yellow-400 bg-yellow-50' :
                  i === 0 ? 'border-red-400 bg-red-50' : 'border-red-200'
                }`}>
                <div className="flex justify-between items-center">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span>{c.rank.icon}</span>
                      <h3 className="font-bold">{c.name}</h3>
                      {i === 0 && <span>👑</span>}
                      {c.wasPromoted && <span className="text-yellow-500">🎖️ ¡PROMOCIÓN!</span>}
                    </div>
                    <div className={`text-sm ${c.rank.color}`}>{c.rank.title}</div>
                    <div className="text-sm text-gray-600">
                      {c.count} entrenamientos {c.lastTraining && `(último: ${c.lastTraining})`}
                    </div>
                  </div>
                  <div className="flex gap-2 items-center">
                    <div className="text-2xl font-bold text-red-600">{c.count}</div>
                    <button onClick={() => incrementCount(c.id)}
                      className="h-12 w-12 bg-red-600 text-white rounded-full">+1</button>
                    <button onClick={() => removeComrade(c.id)}
                      className="text-gray-400 hover:text-red-500">×</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<SovietTrainingTracker />);
