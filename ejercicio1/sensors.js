// Clase Sensor
class Sensor {
    constructor(id, name, type, value, unit, updated_at) {
        this.id = id;
        this.name = name;
        this.type = type; // Se valida mediante el setter
        this.value = value;
        this.unit = unit;
        this.updated_at = updated_at;
    }

    // Setter para actualizar el valor y la fecha de actualización
    set updateValue(newValue) {
        this.value = newValue;
        this.updated_at = new Date().toISOString();
    }

    // Getter y setter para el tipo de sensor con validación
    get type() {
        return this._type;
    }

    set type(newType) {
        const validTypes = ['temperatura', 'humedad', 'presion'];
        if (validTypes.includes(newType)) {
            this._type = newType;
        } else {
            throw new Error(`Invalid type: ${newType}`);
        }
    }

    // Método estático para obtener los tipos válidos de sensores
    static validTypes() {
        return ['temperatura', 'humedad', 'presion'];
    }
}

// Clase SensorManager
class SensorManager {
    constructor() {
        this.sensors = [];
    }

    // Método para añadir un sensor al arreglo
    addSensor(sensor) {
        this.sensors.push(sensor);
    }

    // Método para actualizar un sensor por su ID
    updateSensor(id) {
        const sensor = this.sensors.find(sensor => sensor.id === id);
        if (sensor) {
            let newValue;
            switch (sensor.type) {
                case 'temperatura': // Rango de -30 a 50 grados Celsius
                    newValue = (Math.random() * 80 - 30).toFixed(2);
                    break;
                case 'humedad': // Rango de 0 a 100%
                    newValue = (Math.random() * 100).toFixed(2);
                    break;
                case 'presion': // Rango de 960 a 1040 hPa (hectopascales o milibares)
                    newValue = (Math.random() * 80 + 960).toFixed(2);
                    break;
                default: // Valor por defecto si el tipo es desconocido
                    newValue = (Math.random() * 100).toFixed(2);
            }
            sensor.updateValue = newValue;
            this.render();
        } else {
            console.error(`Sensor ID ${id} no encontrado`);
        }
    }

    // Método asíncrono para cargar sensores desde un archivo JSON
    async loadSensors(url) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            data.forEach(sensorData => {
                const sensor = new Sensor(
                    sensorData.id,
                    sensorData.name,
                    sensorData.type,
                    sensorData.value,
                    sensorData.unit,
                    sensorData.updated_at
                );
                this.addSensor(sensor);
            });
            this.render();
        } catch (error) {
            console.error("Error al cargar los sensores:", error);
        }
    }

    // Método para renderizar los sensores en la página
    render() {
        const container = document.getElementById('sensor-container');
        container.innerHTML = '';
        this.sensors.forEach(sensor => {
            const sensorCard = document.createElement('div');
            sensorCard.className = 'column is-one-third';
            sensorCard.innerHTML = `
                <div class="card">
                    <header class="card-header">
                        <p class="card-header-title">
                            Sensor ID: ${sensor.id}
                        </p>
                    </header>
                    <div class="card-content">
                        <div class="content">
                            <p><strong>Tipo:</strong> ${sensor.type}</p>
                            <p><strong>Valor:</strong> ${sensor.value} ${sensor.unit}</p>
                        </div>
                        <time datetime="${sensor.updated_at}">
                            Última actualización: ${new Date(sensor.updated_at).toLocaleString()}
                        </time>
                    </div>
                    <footer class="card-footer">
                        <a href="#" class="card-footer-item update-button" data-id="${sensor.id}">Actualizar</a>
                    </footer>
                </div>
            `;
            container.appendChild(sensorCard);
        });

        const updateButtons = document.querySelectorAll('.update-button');
        updateButtons.forEach(button => {
            button.addEventListener('click', event => {
                event.preventDefault();
                const sensorId = parseInt(button.getAttribute('data-id'));
                this.updateSensor(sensorId);
            });
        });
    }
}

// Instanciamos el SensorManager y cargamos los sensores
const monitor = new SensorManager();
monitor.loadSensors('sensors.json');
