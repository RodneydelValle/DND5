// Actualiza el proficiency bonus y recalcula habilidades relacionadas
function updateProficiency() {
    const level = parseInt(document.getElementById('level').value);
    const proficiencyBonus = Math.ceil(level / 4) + 1;
    document.getElementById('proficiencyBonus').textContent = `+${proficiencyBonus}`;
    saveData();
}

// Actualiza el modificador del atributo y sus habilidades relacionadas
function updateModifier(attribute) {
    const score = parseInt(document.getElementById(`${attribute}Score`).value);
    const mod = Math.floor((score - 10) / 2);
    document.getElementById(`${attribute}Mod`).textContent = mod >= 0 ? `+${mod}` : mod;

    const proficiencyBonus = parseInt(document.getElementById('proficiencyBonus').textContent.replace('+', ''));
    getRelatedSkills(attribute).forEach(skill => updateSkill(skill, mod, proficiencyBonus));

    saveData();
}

// Actualiza el valor de una habilidad o tirada de salvación
function updateSkill(id, mod, proficiencyBonus) {
    const element = document.getElementById(id);
    const isProficient = document.querySelector(`.circle-small[onclick*="${id}"]`).classList.contains('filled');
    const totalValue = mod + (isProficient ? proficiencyBonus : 0);
    element.textContent = totalValue >= 0 ? `+${totalValue}` : totalValue;
}

// Alterna la clase 'filled' y actualiza la habilidad correspondiente
function toggleFill(element, id, attribute) {
    element.classList.toggle('filled');
    const mod = Math.floor((document.getElementById(`${attribute}Score`).value - 10) / 2);
    const proficiencyBonus = parseInt(document.getElementById('proficiencyBonus').textContent.replace('+', ''));
    updateSkill(id, mod, proficiencyBonus);
    saveData();
}

// Muestra un prompt para cargar una URL de imagen
function promptImageURL() {
    const imageUrl = prompt("Enter the URL of the image:");
    if (imageUrl) {
        document.getElementById('imagePreview').style.backgroundImage = `url('${imageUrl}')`;
        saveData();
    }
}

// Guarda todos los datos en localStorage
function saveData() {
    const data = {
        name: document.getElementById('name').value,
        level: document.getElementById('level').value,
        image: document.getElementById('imagePreview').style.backgroundImage,
        attributes: {},
        skills: {}
    };

    ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(attr => {
        data.attributes[attr] = document.getElementById(`${attr}Score`).value;
    });

    document.querySelectorAll('.circle-small').forEach(el => {
        const skillId = el.getAttribute('onclick').split(',')[1].trim().replace(/'/g, '');
        data.skills[skillId] = el.classList.contains('filled');
    });

    // Guardar de inmediato después de modificar el estado de los círculos pequeños
    localStorage.setItem('characterData', JSON.stringify(data));
}

// Carga todos los datos desde localStorage
function loadData() {
    const data = JSON.parse(localStorage.getItem('characterData'));
    if (!data) return;

    document.getElementById('name').value = data.name || "";
    document.getElementById('level').value = data.level || 1;
    document.getElementById('imagePreview').style.backgroundImage = data.image || "";
    updateProficiency();

    Object.entries(data.attributes || {}).forEach(([attr, value]) => {
        const element = document.getElementById(`${attr}Score`);
        if (element) {
            element.value = value;
            updateModifier(attr); // Recalcula el modificador del atributo y actualiza las habilidades relacionadas
        }
    });

    // Se asegura de que los clics en los círculos pequeños se restauren y no se pierdan
    Object.entries(data.skills || {}).forEach(([skill, isFilled]) => {
        const element = document.querySelector(`.circle-small[onclick*="${skill}"]`);
        if (element) {
            element.classList.toggle('filled', isFilled);
        }
    });

    // Vuelve a calcular después de cargar todos los datos
    recalculateAllModifiersAndSkills();
}

// Recalcula todos los modificadores de atributos y habilidades
function recalculateAllModifiersAndSkills() {
    const proficiencyBonus = parseInt(document.getElementById('proficiencyBonus').textContent.replace('+', ''));
    ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'].forEach(attribute => {
        const mod = Math.floor((document.getElementById(`${attribute}Score`).value - 10) / 2);
        getRelatedSkills(attribute).forEach(skill => updateSkill(skill, mod, proficiencyBonus));
    });
}

// Obtiene todas las habilidades relacionadas con un atributo
function getRelatedSkills(attribute) {
    const relatedSkills = {
        'strength': ['strengthSavingThrow', 'strengthAthletics'],
        'dexterity': ['dexteritySavingThrow', 'dexterityAcrobatics', 'dexteritySleightOfHand', 'dexterityStealth'],
        'constitution': ['constitutionSavingThrow'],
        'intelligence': ['intelligenceSavingThrow', 'intelligenceArcana', 'intelligenceHistory', 'intelligenceInvestigation', 'intelligenceNature', 'intelligenceReligion'],
        'wisdom': ['wisdomSavingThrow', 'wisdomAnimalHandling', 'wisdomInsight', 'wisdomMedicine', 'wisdomPerception', 'wisdomSurvival'],
        'charisma': ['charismaSavingThrow', 'charismaDeception', 'charismaIntimidation', 'charismaPerformance', 'charismaPersuasion']
    };
    return relatedSkills[attribute] || [];
}

// Cargar datos al iniciar
window.onload = loadData;


function toggleColorOptions() {
    const colorOptions = document.getElementById('colorOptions');
    colorOptions.style.display = colorOptions.style.display === 'block' ? 'none' : 'block';
}

function changeColor(type) {
    let color = '';

    switch(type) {
        case 'background':
            color = document.getElementById('backgroundColor').value;
            document.body.style.backgroundColor = color;
            break;
        case 'text':
            color = document.getElementById('textColor').value;
            document.body.style.color = color;
            break;
        case 'line':
            color = document.getElementById('lineColor').value;
            document.querySelectorAll('.box').forEach(el => el.style.borderColor = color);
            break;
        case 'box':
            color = document.getElementById('boxColor').value;
            document.querySelectorAll('.box').forEach(el => el.style.backgroundColor = color);
            break;
    }
}
