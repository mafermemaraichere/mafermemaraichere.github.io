import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Home, Sprout, Apple, CalendarDays, RotateCcw, Database, Save, Upload, PencilLine, Trash2, Plus, X, Copy, CheckCircle, Info, AlertTriangle, ArrowUp, ArrowDown, Leaf, Carrot, TreeDeciduous, Euro } from 'lucide-react'; // Import Lucide React icons, added Euro

// Composant principal de l'application
function App() {
  // --- États de l'application ---
  const [activeSection, setActiveSection] = useState('dashboard'); // 'dashboard', 'cultures', 'recoltes', 'calendar', 'rotation', 'vegetable_database', 'chiffrage_cultures'

  // États pour les données des cultures (définitions des plantes)
  const [crops, setCrops] = useState([]);
  const [editingCropId, setEditingCropId] = useState(null);
  const [cropFormName, setCropFormName] = useState('');
  const [cropFormVariety, setCropFormVariety] = useState('');
  const [cropFormTypicalPlantingDate, setCropFormTypicalPlantingDate] = useState('');
  const [cropFormTypicalSowingDate, setCropFormTypicalSowingDate] = useState('');
  const [cropFormTypicalHarvestStartDate, setCropFormTypicalHarvestStartDate] = useState('');
  const [cropFormTypicalHarvestEndDate, setCropFormTypicalHarvestEndDate] = useState('');
  const [cropFormBedSize, setCropFormBedSize] = useState('');
  const [cropFormNumberOfBeds, setCropFormNumberOfBeds] = useState('');
  const [cropFormRowsPerBed, setCropFormRowsPerBed] = useState(''); // This will now be calculated
  const [cropFormSpacing, setCropFormSpacing] = useState('');
  const [cropFormNotes, setCropFormNotes] = '';
  const [cropFormNumberOfPlants, setCropFormNumberOfPlants] = useState(0);

  // Nouveaux états pour la parcelle et la famille (intégration des améliorations)
  const [cropFormPlot, setCropFormPlot] = useState(''); // Contient l'ID de la parcelle sélectionnée ou le nom de la parcelle personnalisée
  const [isCustomPlotInputVisible, setIsCustomPlotInputVisible] = useState(false);
  const [customPlotName, setCustomPlotName] = useState('');
  const [customPlotFamily, setCustomPlotFamily] = useState(''); // Pour la famille d'une parcelle personnalisée

  const [cropFormFamily, setCropFormFamily] = useState(''); // Famille affichée ou sélectionnée pour la culture
  const [isCustomCropNameInputVisible, setIsCustomCropNameInputVisible] = useState(false);
  const [customCropName, setCustomCropName] = useState('');

  // États pour les données des récoltes (enregistrements spécifiques)
  const [harvests, setHarvests] = useState([]);
  const [editingHarvestId, setEditingHarvestId] = useState(null);
  const [harvestFormCropId, setHarvestFormCropId] = useState('');
  const [harvestFormStartDate, setHarvestFormStartDate] = useState('');
  const [harvestFormEndDate, setHarvestFormEndDate] = useState('');
  const [harvestFormActualQuantity, setHarvestFormActualQuantity] = useState('');
  const [harvestFormUnit, setHarvestFormUnit] = useState('Kg');
  const [harvestFormPlot, setHarvestFormPlot] = useState('');
  const [harvestFormNotes, setHarvestFormNotes] = '';
  const [harvestFormEstimatedPerPlant, setHarvestFormEstimatedPerPlant] = useState('');
  const [harvestFormEstimatedPerPlantUnit, setHarvestFormEstimatedPerPlantUnit] = useState('Kg');
  const [harvestFormPricePerKg, setHarvestFormPricePerKg] = useState('');
  const [harvestFormTotalEstimated, setHarvestFormTotalEstimated] = useState(0);
  const [harvestFormTotalEstimatedUnit, setHarvestFormTotalEstimatedUnit] = useState('Kg');
  const [harvestFormEstimatedTotalPrice, setHarvestFormEstimatedTotalPrice] = useState(0);

  // --- États généraux de l'application ---
  const [isLoading, setIsLoading] = useState(true); // État de chargement initial

  // --- États pour la confirmation de suppression (générique) ---
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); // { id, type: 'crop' | 'harvest' | 'vegetable' | 'plot', name }

  // --- États pour la confirmation d'importation JSON (globale) ---
  const [showImportAllConfirmModal, setShowImportAllConfirmModal] = useState(false);
  const [fileToImportAll, setFileToImportAll] = useState(null);

  // --- États pour la confirmation d'importation CSV (légumes) ---
  const [showImportVegCSVConfirmModal, setShowImportVegCSVConfirmModal] = useState(false);
  const [fileToImportVegCSV, setFileToImportVegCSV] = useState(null);
  const [csvImportMode, setCsvImportMode] = useState('merge'); // 'merge' or 'replace'


  // --- Nouveaux états pour le modal de duplication de culture ---
  const [showDuplicateCropModal, setShowDuplicateCropModal] = useState(false);
  const [cropToDuplicate, setCropToDuplicate] = useState(null);
  const [numberOfCropCopies, setNumberOfCropCopies] = useState(1);

  // --- Nouveaux états pour le modal de duplication de parcelle ---
  const [showDuplicatePlotModal, setShowDuplicatePlotModal] = useState(false);
  const [plotToDuplicate, setPlotToDuplicate] = useState(null);
  const [numberOfPlotCopies, setNumberOfPlotCopies] = useState(1);

  // --- Nouveaux états pour le message personnalisé (remplace alert()) ---
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageModalContent, setMessageModalContent] = useState({ title: '', body: '', type: 'info' }); // type: 'success', 'error', 'info'

  // --- Nouvel état pour le focus de champ dans le formulaire de culture ---
  const [focusInputField, setFocusInputField] = useState(null);

  // --- Ref pour le formulaire de culture ---
  const cropFormRef = useRef(null); // Create a ref

  // --- États pour le filtrage des cultures ---
  const [cropFilterType, setCropFilterType] = useState('name'); // 'name', 'variety', 'plot'
  const [cropFilterValue, setCropFilterValue] = useState('');
  // États pour le tri des cultures
  const [cropSortColumn, setCropSortColumn] = useState('name');
  const [cropSortDirection, setCropSortDirection] = useState('asc');

  // --- États et données pour la Base de Données de Légumes (maintenant en mémoire) ---
  const [vegetables, setVegetables] = useState([]);
  const [editingVegId, setEditingVegId] = useState(null);
  const [vegFormName, setVegFormName] = useState('');
  const [vegFormVariety, setVegFormVariety] = useState('');
  const [vegFormFamily, setVegFormFamily] = useState('');
  const [vegFormSowingPeriod, setVegFormSowingPeriod] = useState('');
  const [vegFormPlantingPeriod, setVegFormPlantingPeriod] = useState('');
  const [vegFormCultureDuration, setVegFormCultureDuration] = useState('');
  const [vegFormPlantSpacing, setVegFormPlantSpacing] = useState(''); // Renamed from vegFormSpacing
  const [vegFormRowSpacing, setVegFormRowSpacing] = useState(''); // New state for row spacing
  const [vegFormUnitCost, setVegFormUnitCost] = useState(''); // New state for unit cost
  const [vegFormCostingUnit, setVegFormCostingUnit] = useState('plant'); // New state for costing unit ('plant', 'graine', 'sachet')


  // --- États pour le filtrage de la Base de Données de Légumes ---
  const [vegFilterType, setVegFilterType] = useState('name'); // 'name', 'variety', 'family'
  const [vegFilterValue, setVegFilterValue] = useState('');
  // New state for selected vegetables for bulk delete
  const [selectedVegetables, setSelectedVegetables] = useState([]);

  // --- États pour le tri de la Base de Données de Légumes ---
  const [vegSortColumn, setVegSortColumn] = useState('name'); // Default sort by name
  const [vegSortDirection, setVegSortDirection] = useState('asc'); // Default ascending

  // --- Nouveaux états pour la gestion des parcelles (Rotation) ---
  const [plots, setPlots] = useState([]);
  const [plotFormName, setPlotFormName] = useState('');
  const [plotFormFamily, setPlotFormFamily] = useState(''); // Famille sélectionnée ou personnalisée
  const [plotFormNotes, setPlotFormNotes] = '';
  // Nouveaux états pour la taille et le nombre de planches des parcelles
  const [plotFormBedSize, setPlotFormBedSize] = useState('');
  const [plotFormNumberOfBeds, setPlotFormNumberOfBeds] = useState('');
  const [plotFormArea, setPlotFormArea] = useState(0); // Nouveau: Superficie de la parcelle
  // États pour le filtrage des parcelles
  const [plotFilterType, setPlotFilterType] = useState('name'); // 'name', 'family'
  const [plotFilterValue, setPlotFilterValue] = useState('');
  // États pour le tri des parcelles
  const [plotSortColumn, setPlotSortColumn] = useState('name');
  const [plotSortDirection, setPlotSortDirection] = useState('asc');


  const [editingPlotId, setEditingPlotId] = useState(null);
  const [uniqueVegetableFamilies, setUniqueVegetableFamilies] = useState([]); // Liste des familles uniques de la base de données (dérivée localement)
  const [isCustomFamilyInputVisible, setIsCustomFamilyInputVisible] = useState(false); // Visibilité du champ de saisie personnalisée
  const [customFamilyName, setCustomFamilyName] = useState('');
  const [isPlotFamilyChangeDisabled, setIsPlotFamilyChangeDisabled] = useState(false); // Nouveau: désactiver le changement de famille si cultures associées

  // --- Nouveaux états pour le modal d'ajout depuis le calendrier ---
  const [showAddFromCalendarModal, setShowAddFromCalendarModal] = useState(false);
  const [calendarModalMonthIndex, setCalendarModalMonthIndex] = useState(null);
  const [calendarModalWeekIndex, setCalendarModalWeekIndex] = useState(null);
  const [calendarModalSelectedPlotId, setCalendarModalSelectedPlotId] = useState('');
  const [calendarModalSelectedVegId, setCalendarModalSelectedVegId] = useState('');

  // --- États pour le filtrage du calendrier (unifié) ---
  const [calendarFilterType, setCalendarFilterType] = useState('name'); // 'name', 'plot', 'family'
  const [calendarFilterValue, setCalendarFilterValue] = useState('');


  // --- Données initiales pour la Base de Données de Légumes (maintenant vide) ---
  const initialVegetableData = []; // Vide comme demandé

  // --- Initialisation de l'état local au démarrage de l'application ---
  // Utilise un effet sans dépendances pour s'assurer qu'il ne s'exécute qu'une fois.
  useEffect(() => {
    // Charge les données initiales des légumes avec un ID unique pour chaque entrée.
    const initialVegetablesWithIds = initialVegetableData.map(veg => ({
      ...veg,
      id: Math.random().toString(36).substr(2, 9) // Génère un ID simple local
    }));
    setVegetables(initialVegetablesWithIds);
    // Au démarrage, le chargement est terminé car il n'y a pas d'appel réseau.
    setIsLoading(false);
  }, []); // Tableau de dépendances vide pour exécution unique au montage

  // Met à jour les familles uniques de légumes à chaque changement dans la liste des légumes
  useEffect(() => {
    const families = new Set();
    vegetables.forEach(veg => {
        if (veg.family) {
            families.add(veg.family);
        }
    });
    const sortedFamilies = Array.from(families).sort();
    setUniqueVegetableFamilies(sortedFamilies);
  }, [vegetables]);


  // --- Fonction utilitaire pour extraire la longueur de la taille de la planche ---
  const getBedLength = (bedSizeStr) => {
      if (!bedSizeStr) return 0;
      const parts = bedSizeStr.toLowerCase().split('x');
      if (parts.length > 0) {
          const length = parseFloat(parts[0]);
          return isNaN(length) ? 0 : length;
      }
      return 0;
  };

  // --- Fonction utilitaire pour extraire la largeur de la taille de la planche ---
  const getBedWidth = (bedSizeStr) => {
      if (!bedSizeStr) return 0;
      const parts = bedSizeStr.toLowerCase().split('x');
      if (parts.length > 1) {
          const width = parseFloat(parts[1]);
          return isNaN(width) ? 0 : width;
      }
      return 0;
  };

  // --- Effet pour calculer le nombre de plants pour les cultures ---
  useEffect(() => {
    const numBeds = parseInt(cropFormNumberOfBeds) || 0;
    const rowsPer = parseInt(cropFormRowsPerBed) || 0; // Use the calculated rowsPerBed
    const spacingVal = parseFloat(cropFormSpacing) || 0;
    const bedLength = getBedLength(cropFormBedSize);

    let calculatedPlants = 0;
    // Vérifiez que tous les dénominateurs ne sont pas zéro pour éviter les erreurs
    if (numBeds > 0 && bedLength > 0 && spacingVal > 0 && rowsPer > 0) {
      calculatedPlants = numBeds * (bedLength / spacingVal) * rowsPer;
    }
    setCropFormNumberOfPlants(Math.floor(calculatedPlants)); // Arrondir à l'entier inférieur pour le nombre de plants
  }, [cropFormNumberOfBeds, cropFormBedSize, cropFormSpacing, cropFormRowsPerBed]);


  // --- Effet pour calculer le nombre de rangs par planche (rowsPerBed) ---
  useEffect(() => {
    const bedWidth = getBedWidth(cropFormBedSize);
    const selectedVeg = vegetables.find(veg => veg.name === cropFormName);

    if (bedWidth > 0 && selectedVeg && parseFloat(selectedVeg.rowSpacing) > 0) {
        const rowSpacing = parseFloat(selectedVeg.rowSpacing);
        let calculatedRows = bedWidth / rowSpacing;

        if (calculatedRows >= 1) {
            setCropFormRowsPerBed(Math.floor(calculatedRows).toString());
        } else {
            setCropFormRowsPerBed('1'); // Set to 1 if less than 1
        }
    } else {
        // If conditions for calculation are not met, default.
        // If editing, we might have an existing value, but if the source data for calculation is missing/invalid,
        // it's better to default or indicate. For now, we'll default to 1 if no calculation is possible.
        // If editingCropId is null (new crop) or if the current plot/veg selection doesn't allow calculation, default.
        if (!editingCropId || (bedWidth === 0 || !selectedVeg || parseFloat(selectedVeg.rowSpacing) === 0)) {
            setCropFormRowsPerBed('1'); // Default to 1 if calculation is not possible
        }
        // If editingCropId is not null, and the conditions for calculation are not met,
        // we keep the existing cropFormRowsPerBed value loaded from the crop,
        // unless the user changes plot/veg to something that *does* allow calculation.
        // The current logic will recalculate if dependencies change, which is desired.
    }
}, [cropFormBedSize, cropFormName, vegetables, editingCropId]); // Add editingCropId to dependencies to prevent immediate reset when loading an existing crop

  // --- Effet pour calculer la superficie de la parcelle ---
  useEffect(() => {
      const length = getBedLength(plotFormBedSize);
      const width = getBedWidth(plotFormBedSize);
      const numBeds = parseInt(plotFormNumberOfBeds) || 0;
      const calculatedArea = (length * width * numBeds).toFixed(2); // Calculate total area and round to 2 decimal places
      setPlotFormArea(parseFloat(calculatedArea)); // Store as a number
  }, [plotFormBedSize, plotFormNumberOfBeds]);


  // --- Effet pour pré-remplir les dates de récolte, calculer la récolte totale estimée et le prix total estimé ---
  useEffect(() => {
    // Pré-remplir les dates de récolte et la parcelle lorsque la sélection de culture change
    if (harvestFormCropId) {
      const selectedCrop = crops.find(c => c.id === harvestFormCropId);
      if (selectedCrop) {
        setHarvestFormStartDate(selectedCrop.typicalHarvestStartDate || '');
        setHarvestFormEndDate(selectedCrop.typicalHarvestEndDate || '');
        // Pré-remplir la parcelle à partir de la culture sélectionnée
        if (!editingHarvestId) { // Ne pré-remplir que si ce n'est pas une édition existante pour éviter d'écraser la parcelle de la récolte existante
          setHarvestFormPlot(selectedCrop.plot || '');
        }
      }
    } else {
      // Effacer les dates et la parcelle si aucune culture n'est sélectionnée
      setHarvestFormStartDate('');
      setHarvestFormEndDate('');
      if (!editingHarvestId) { // Effacer uniquement si pas en mode édition
        setHarvestFormPlot('');
      }
    }

    // Calculer la récolte totale estimée
    const estimatedPerPlant = parseFloat(harvestFormEstimatedPerPlant) || 0;
    const pricePerKg = parseFloat(harvestFormPricePerKg) || 0;
    let totalCalculatedPlants = 0;

    if (harvestFormCropId) {
      const selectedCrop = crops.find(c => c.id === harvestFormCropId);
      if (selectedCrop) {
        totalCalculatedPlants = selectedCrop.numberOfPlants || 0;
      }
    }

    const totalEstimated = estimatedPerPlant * totalCalculatedPlants;
    setHarvestFormTotalEstimated(totalEstimated.toFixed(2)); // Garder deux décimales pour l'affichage
    // Mettre à jour l'unité de récolte totale estimée pour qu'elle corresponde à celle par plant
    setHarvestFormTotalEstimatedUnit(harvestFormEstimatedPerPlantUnit);

    const estimatedTotalPrice = totalEstimated * pricePerKg;
    setHarvestFormEstimatedTotalPrice(estimatedTotalPrice.toFixed(2)); // Garder deux décimales pour l'affichage

  }, [harvestFormCropId, crops, harvestFormEstimatedPerPlant, harvestFormPricePerKg, harvestFormEstimatedPerPlantUnit, editingHarvestId]);

  // --- Effet pour focaliser le champ après redirection ---
  useEffect(() => {
    if (activeSection === 'cultures' && focusInputField) {
      const inputElement = document.getElementById(focusInputField);
      if (inputElement) {
        inputElement.focus();
        // Optionnel: ajouter un surlignage temporaire pour indiquer le focus
        inputElement.classList.add('ring-2', 'ring-blue-400', 'transition-all', 'duration-300');
        const timer = setTimeout(() => {
          inputElement.classList.remove('ring-2', 'ring-blue-400');
          setFocusInputField(null); // Réinitialiser l'état de focus
        }, 1500); // Surlignage pendant 1.5 seconde
        return () => clearTimeout(timer);
      }
    }
  }, [activeSection, focusInputField]);


  // --- Fonction pour afficher les messages personnalisés ---
  const showCustomMessage = (title, body, type = 'info') => {
    setMessageModalContent({ title, body, type });
    setShowMessageModal(true);
  };

  // --- Fonction pour fermer les messages personnalisés ---
  const closeMessageModal = () => {
    setShowMessageModal(false);
    setMessageModalContent({ title: '', body: '', type: 'info' });
  };


  // --- Gestion de l'ajout/modification d'une culture ---
  const handleAddOrUpdateCrop = (e) => {
    e.preventDefault();

    // Determine the final plot name and family based on selection or custom input
    let finalPlotName = '';
    let finalPlotId = null;
    let finalPlotFamily = '';
    let finalPlotBedSize = ''; // New
    let finalPlotNumberOfBeds = 0; // New
    let finalPlotArea = 0; // New: Area of the plot

    if (isCustomPlotInputVisible) {
        if (!customPlotName.trim() || !customPlotFamily.trim()) {
            showCustomMessage('Champs obligatoires manquants', 'Veuillez saisir le nom et la famille pour la nouvelle parcelle personnalisée.', 'error');
            return;
        }
        finalPlotName = customPlotName.trim();
        finalPlotFamily = customPlotFamily.trim();
        finalPlotBedSize = cropFormBedSize; // Use the value from cropFormBedSize as it's the custom input
        finalPlotNumberOfBeds = parseInt(cropFormNumberOfBeds) || 0; // Use the value from cropFormNumberOfBeds
        finalPlotArea = (getBedLength(finalPlotBedSize) * getBedWidth(finalPlotBedSize) * finalPlotNumberOfBeds).toFixed(2);

        // Check if the custom plot already exists, if not, add it
        const existingPlot = plots.find(p => p.name.toLowerCase() === finalPlotName.toLowerCase());
        if (!existingPlot) {
            const newPlotId = Math.random().toString(36).substr(2, 9);
            finalPlotId = newPlotId;
            setPlots(prevPlots => {
                const newPlot = { id: newPlotId, name: finalPlotName, assignedFamily: finalPlotFamily, notes: '', bedSize: finalPlotBedSize, numberOfBeds: finalPlotNumberOfBeds, area: parseFloat(finalPlotArea) };
                const updatedPlots = [...prevPlots, newPlot];
                updatedPlots.sort((a, b) => a.name.localeCompare(b.name));
                return updatedPlots;
            });
        } else {
            finalPlotId = existingPlot.id;
            // If the custom plot exists, update its bedSize and numberOfBeds if they were just entered
            // This ensures consistency if a user custom-adds a plot via the crop form
            if (existingPlot.bedSize !== finalPlotBedSize || existingPlot.numberOfBeds !== finalPlotNumberOfBeds || existingPlot.area !== parseFloat(finalPlotArea)) {
                setPlots(prevPlots => prevPlots.map(p =>
                    p.id === existingPlot.id ? { ...p, bedSize: finalPlotBedSize, numberOfBeds: finalPlotNumberOfBeds, area: parseFloat(finalPlotArea) } : p
                ));
            }
        }
    } else {
        const selectedPlotObj = plots.find(p => p.id === cropFormPlot);
        if (!selectedPlotObj) {
            showCustomMessage('Champs obligatoires manquants', 'Veuillez sélectionner une parcelle ou en ajouter une nouvelle.', 'error');
            return;
        }
        finalPlotName = selectedPlotObj.name;
        finalPlotId = selectedPlotObj.id;
        finalPlotFamily = selectedPlotObj.assignedFamily;
        finalPlotBedSize = selectedPlotObj.bedSize || ''; // Get from selected plot
        finalPlotNumberOfBeds = selectedPlotObj.numberOfBeds || 0; // Get from selected plot
        finalPlotArea = selectedPlotObj.area || 0; // Get area from selected plot
    }

    // Determine the final crop name and variety
    let finalCropName = '';
    let finalCropVariety = cropFormVariety; // Start with current variety state

    if (isCustomCropNameInputVisible) {
        if (!customCropName.trim()) {
            showCustomMessage('Champs obligatoires manquants', 'Veuillez saisir le nom de la culture personnalisée.', 'error');
            return;
        }
        finalCropName = customCropName.trim();
    } else {
        if (!cropFormName) {
            showCustomMessage('Champs obligatoires manquants', 'Veuillez sélectionner un nom de culture ou en ajouter un nouveau.', 'error');
            return;
        }
        finalCropName = cropFormName;
        // If an existing vegetable was selected, its variety is already in cropFormVariety via useEffect
    }


    if (!finalCropName || !cropFormTypicalPlantingDate || !cropFormTypicalHarvestStartDate) {
      showCustomMessage('Champs obligatoires manquants', 'Veuillez remplir les champs obligatoires : Nom de la culture, Date de plantation, Date de début de récolte.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const cropData = {
        name: finalCropName,
        variety: finalCropVariety || '',
        typicalPlantingDate: cropFormTypicalPlantingDate,
        typicalSowingDate: cropFormTypicalSowingDate || '',
        typicalHarvestStartDate: cropFormTypicalHarvestStartDate,
        typicalHarvestEndDate: cropFormTypicalHarvestEndDate || '',
        bedSize: finalPlotBedSize, // Use the bed size from the plot
        numberOfBeds: finalPlotNumberOfBeds, // Use the number of beds from the plot
        rowsPerBed: parseInt(cropFormRowsPerBed) || 0, // Use the calculated value
        spacing: cropFormSpacing ? parseFloat(cropFormSpacing) : 0,
        numberOfPlants: cropFormNumberOfPlants,
        notes: cropFormNotes || '',
        plot: finalPlotName, // Save the actual plot name
        plotId: finalPlotId, // Store plot ID
        assignedFamily: finalPlotFamily, // Save the assigned family of the plot
        plotArea: parseFloat(finalPlotArea), // Store the plot area
      };

      if (editingCropId) {
        // Mise à jour de la culture existante
        setCrops(prevCrops =>
          prevCrops.map(crop => (crop.id === editingCropId ? { ...crop, ...cropData } : crop))
        );
        showCustomMessage('Succès', 'Culture modifiée avec succès !', 'success');
        setEditingCropId(null);
      } else {
        // Ajout d'une nouvelle culture avec un ID unique
        const newCrop = { ...cropData, id: Math.random().toString(36).substr(2, 9) };
        setCrops(prevCrops => {
          const updatedCrops = [...prevCrops, newCrop];
          updatedCrops.sort((a, b) => a.name.localeCompare(b.name));
          return updatedCrops;
        });
        showCustomMessage('Succès', 'Nouvelle culture ajoutée avec succès !', 'success');
      }
      resetCropForm();
    } catch (error) {
      console.error(`Erreur lors de l'ajout/modification de la culture:`, error);
      showCustomMessage('Erreur', `Erreur lors de l'ajout/modification de la culture: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Réinitialise le formulaire de culture ---
  const resetCropForm = () => {
    setCropFormPlot('');
    setIsCustomPlotInputVisible(false);
    setCustomPlotName('');
    setCustomPlotFamily('');
    setCropFormFamily(''); // Clear the derived family

    setCropFormName('');
    setCropFormVariety('');
    setIsCustomCropNameInputVisible(false);
    setCustomCropName('');

    setCropFormTypicalSowingDate('');
    setCropFormTypicalPlantingDate('');
    setCropFormTypicalHarvestStartDate('');
    setCropFormTypicalHarvestEndDate('');
    setCropFormBedSize(''); // Reset bed size for crop form
    setCropFormNumberOfBeds(''); // Reset number of beds for crop form
    setCropFormRowsPerBed(''); // Reset calculated rows per bed
    setCropFormSpacing('');
    setCropFormNotes('');
    setCropFormNumberOfPlants(0);
    setEditingCropId(null);
    setFocusInputField(null); // Clear focus when resetting form
  };

  // --- Met une culture en mode édition ---
  const handleEditCropClick = (crop) => {
    setEditingCropId(crop.id);

    // Set plot and family for editing
    const existingPlot = plots.find(p => p.id === crop.plotId);
    if (existingPlot) {
      setCropFormPlot(existingPlot.id); // Set to ID
      setIsCustomPlotInputVisible(false);
      setCustomPlotName('');
      setCustomPlotFamily('');
      setCropFormFamily(existingPlot.assignedFamily); // Set derived family
      setCropFormBedSize(existingPlot.bedSize || ''); // Load bed size from plot
      setCropFormNumberOfBeds(existingPlot.numberOfBeds ? existingPlot.numberOfBeds.toString() : ''); // Load number of beds from plot
    } else {
      // It's a custom plot not in the current plots list, or plotId was null/missing
      setCropFormPlot('autre'); // Set dropdown to "Autre"
      setIsCustomPlotInputVisible(true);
      setCustomPlotName(crop.plot || ''); // Set custom plot name, default to empty string if undefined
      setCustomPlotFamily(crop.assignedFamily || ''); // Set custom plot family, default to empty string if undefined
      setCropFormFamily(crop.assignedFamily || ''); // Set derived family, default to empty string if undefined
      setCropFormBedSize(crop.bedSize || ''); // Load bed size from crop itself if plot not found
      setCropFormNumberOfBeds(crop.numberOfBeds ? crop.numberOfBeds.toString() : ''); // Load number of beds from crop itself
    }

    // Set crop name and variety for editing
    const existingVeg = vegetables.find(v => v.name === crop.name && (v.variety || '') === (crop.variety || ''));
    if (existingVeg) {
        setCropFormName(crop.name); // Set to existing vegetable name
        setCropFormVariety(existingVeg.variety || ''); // Pre-fill variety from existingVeg
        setIsCustomCropNameInputVisible(false);
        setCustomCropName('');
    } else {
        setCropFormName('autre'); // Set dropdown to "Autre"
        setIsCustomCropNameInputVisible(true);
        setCustomCropName(crop.name); // Set custom crop name
        setCropFormVariety(crop.variety || ''); // Pre-fill custom variety
    }


    setCropFormTypicalSowingDate(crop.typicalSowingDate || '');
    setCropFormTypicalPlantingDate(crop.typicalPlantingDate || '');
    setCropFormTypicalHarvestStartDate(crop.typicalHarvestStartDate || '');
    setCropFormTypicalHarvestEndDate(crop.typicalHarvestEndDate || '');
    setCropFormRowsPerBed(crop.rowsPerBed ? crop.rowsPerBed.toString() : ''); // Load existing rowsPerBed
    setCropFormSpacing(crop.spacing ? crop.spacing.toString() : '');
    setCropFormNotes(crop.notes);
    setCropFormNumberOfPlants(crop.numberOfPlants || 0);
    setActiveSection('cultures');
    // Scroll to the form after setting the active section and form data
    if (cropFormRef.current) {
        cropFormRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // --- Annule le mode édition de la culture ---
  const handleCancelCropEdit = () => {
    setEditingCropId(null);
    resetCropForm();
  };

  // --- Prépare la suppression d'une culture ---
  const handleDeleteCropClick = (crop) => {
    setItemToDelete({ id: crop.id, type: 'crop', name: crop.name });
    setShowConfirmModal(true);
  };

  // --- Gère le clic sur le bouton "Dupliquer (ouvre le modal) pour les cultures ---
  const handleDuplicateCropClick = (crop) => {
    setCropToDuplicate(crop);
    setNumberOfCropCopies(1); // Default to 1 copy
    setShowDuplicateCropModal(true);
  };

  // --- Confirme et exécute la duplication (pour plusieurs copies) de culture ---
  const confirmDuplicateCropAction = () => {
    if (!cropToDuplicate || numberOfCropCopies <= 0) {
        showCustomMessage('Erreur de duplication', 'Impossible de dupliquer. Des informations essentielles sont manquantes.', 'error');
        resetDuplicateCropModal();
        return;
    }

    setIsLoading(true);
    try {
        const originalBaseName = cropToDuplicate.name.replace(/ (\d+)$/, '');
        const newCrops = [];
        let highestExistingSuffix = 0;

        // Find the highest existing suffix for the base name
        crops.forEach(c => {
            const match = c.name.match(new RegExp(`^${originalBaseName}(?: (\\d+))?$`));
            if (match) {
                const currentSuffix = match[1] ? parseInt(match[1]) : (c.name === originalBaseName ? 0 : NaN);
                if (!isNaN(currentSuffix)) {
                    highestExistingSuffix = Math.max(highestExistingSuffix, currentSuffix);
                }
            }
        });

        let currentSuffixForNewCopies = highestExistingSuffix + 1;
        const generatedNamesInBatch = new Set(); // Keep track of names generated in *this batch*

        for (let i = 0; i < numberOfCropCopies; i++) {
            let newName = `${originalBaseName} ${currentSuffixForNewCopies}`;
            // Ensure uniqueness within the existing crops and within the current batch of new crops
            while (crops.some(c => c.name === newName) || generatedNamesInBatch.has(newName)) {
                currentSuffixForNewCopies++;
                newName = `${originalBaseName} ${currentSuffixForNewCopies}`;
            }

            const duplicatedCropData = {
                ...cropToDuplicate,
                name: newName,
                id: Math.random().toString(36).substr(2, 9), // Génère un nouvel ID unique localement
            };
            newCrops.push(duplicatedCropData);
            generatedNamesInBatch.add(newName);
            currentSuffixForNewCopies++;
        }

        setCrops(prevCrops => {
            const updatedCrops = [...prevCrops, ...newCrops];
            updatedCrops.sort((a, b) => a.name.localeCompare(b.name));
            return updatedCrops;
        });

        showCustomMessage('Duplication réussie !', `${numberOfCropCopies} copies de "${cropToDuplicate.name}" ont été créées avec succès !`, 'success');
        resetDuplicateCropModal();
    } catch (error) {
        console.error(`Erreur critique lors de la duplication des cultures:`, error);
        showCustomMessage('Échec de la duplication', `Erreur : ${error.message}.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetDuplicateCropModal = () => {
    setShowDuplicateCropModal(false);
    setCropToDuplicate(null);
    setNumberOfCropCopies(1);
  };


  // --- Gestion de l'ajout/modification d'une récolte ---
  const handleAddOrUpdateHarvest = (e) => {
    e.preventDefault();
    if (!harvestFormCropId || !harvestFormStartDate || !harvestFormActualQuantity || !harvestFormPlot) {
      showCustomMessage('Champs obligatoires manquants', 'Veuillez remplir les champs obligatoires : Culture, Date de Début de Récolte, Quantité réelle récoltée, Parcelle.', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const selectedCrop = crops.find(c => c.id === harvestFormCropId);
      const harvestData = {
        cropId: harvestFormCropId,
        cropName: selectedCrop ? selectedCrop.name : 'Culture inconnue',
        variety: selectedCrop ? selectedCrop.variety : '',
        harvestStartDate: harvestFormStartDate,
        harvestEndDate: harvestFormEndDate || '',
        actualQuantity: parseFloat(harvestFormActualQuantity),
        unit: harvestFormUnit,
        plot: harvestFormPlot,
        notes: harvestFormNotes || '',
        estimatedPerPlant: parseFloat(harvestFormEstimatedPerPlant) || 0,
        estimatedPerPlantUnit: harvestFormEstimatedPerPlantUnit,
        pricePerKg: parseFloat(harvestFormPricePerKg) || 0,
        totalEstimated: harvestFormTotalEstimated ? parseFloat(harvestFormTotalEstimated) : 0,
        totalEstimatedUnit: harvestFormTotalEstimatedUnit,
        estimatedTotalPrice: harvestFormEstimatedTotalPrice ? parseFloat(harvestFormEstimatedTotalPrice) : 0,
      };

      if (editingHarvestId) {
        // Mise à jour de la récolte existante
        setHarvests(prevHarvests =>
          prevHarvests.map(harvest => (harvest.id === editingHarvestId ? { ...harvest, ...harvestData } : harvest))
        );
        showCustomMessage('Succès', 'Récolte modifiée avec succès !', 'success');
        setEditingHarvestId(null);
      } else {
        // Ajout d'une nouvelle récolte avec un ID unique
        const newHarvest = { ...harvestData, id: Math.random().toString(36).substr(2, 9) };
        setHarvests(prevHarvests => {
          const updatedHarvests = [...prevHarvests, newHarvest];
          // Trier par date de récolte la plus récente en JavaScript
          updatedHarvests.sort((a, b) => new Date(b.harvestStartDate) - new Date(a.harvestStartDate));
          return updatedHarvests;
        });
        showCustomMessage('Succès', 'Nouvelle récolte ajoutée avec succès !', 'success');
      }
      resetHarvestForm();
    } catch (error) {
      console.error(`Erreur lors de l'ajout/modification de la récolte:`, error);
      showCustomMessage('Erreur', `Erreur lors de l'ajout/modification de la récolte: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Réinitialise le formulaire de récolte ---
  const resetHarvestForm = () => {
    setHarvestFormCropId('');
    setHarvestFormStartDate('');
    setHarvestFormEndDate('');
    setHarvestFormActualQuantity('');
    setHarvestFormUnit('Kg');
    setHarvestFormPlot('');
    setHarvestFormNotes('');
    setHarvestFormEstimatedPerPlant('');
    setHarvestFormEstimatedPerPlantUnit('Kg');
    setHarvestFormPricePerKg('');
    setHarvestFormTotalEstimated(0);
    setHarvestFormTotalEstimatedUnit('Kg');
    setHarvestFormEstimatedTotalPrice(0);
  };

  // --- Met une récolte en mode édition ---
  const handleEditHarvestClick = (harvest) => {
    setEditingHarvestId(harvest.id);
    setHarvestFormCropId(harvest.cropId);
    setHarvestFormStartDate(harvest.harvestStartDate || '');
    setHarvestFormEndDate(harvest.harvestEndDate || '');
    setHarvestFormActualQuantity(harvest.actualQuantity ? harvest.actualQuantity.toString() : '');
    setHarvestFormUnit(harvest.unit || 'Kg');
    setHarvestFormPlot(harvest.plot || '');
    setHarvestFormNotes(harvest.notes || '');
    setHarvestFormEstimatedPerPlant(harvest.estimatedPerPlant ? harvest.estimatedPerPlant.toString() : '');
    setHarvestFormEstimatedPerPlantUnit(harvest.estimatedPerPlantUnit || 'Kg');
    setHarvestFormPricePerKg(harvest.pricePerKg ? harvest.pricePerKg.toString() : '');
    setActiveSection('recoltes');
  };

  // --- Annule le mode édition de la récolte ---
  const handleCancelHarvestEdit = () => {
    setEditingHarvestId(null);
    resetHarvestForm();
  };

  // --- Prépare la suppression d'une récolte ---
  const handleDeleteHarvestClick = (harvest) => {
    setItemToDelete({
      id: harvest.id,
      type: 'harvest',
      name: harvest.cropName,
      date: harvest.harvestStartDate
    });
    setShowConfirmModal(true);
  };

  // --- Fonctions pour la Base de Données de Légumes (Ajout/Modification/Suppression) ---
  const handleAddOrUpdateVegetable = (e) => {
    e.preventDefault();
    if (!vegFormName || !vegFormFamily || !vegFormSowingPeriod || !vegFormPlantingPeriod || !vegFormCultureDuration) {
      showCustomMessage('Champs obligatoires manquants', 'Veuillez remplir les champs obligatoires (Nom, Famille, Période de semis, Période de plantation, Durée de culture).', 'error');
      return;
    }

    // Convert name and variety to lowercase for case-insensitive comparison
    const lowerCaseName = vegFormName.toLowerCase();
    const lowerCaseVariety = (vegFormVariety || '').toLowerCase();

    let isDuplicate = false;
    vegetables.forEach((veg) => {
      if ((editingVegId ? veg.id !== editingVegId : true) &&
          veg.name.toLowerCase() === lowerCaseName &&
          (veg.variety || '').toLowerCase() === lowerCaseVariety) {
        isDuplicate = true;
      }
    });

    if (isDuplicate) {
      showCustomMessage('Doublon détecté', 'Un légume avec ce nom et cette variété existe déjà dans la base de données.', 'error');
      return; // Stop the function if a duplicate is found
    }

    setIsLoading(true);
    try {
      const vegData = {
        name: vegFormName,
        variety: vegFormVariety || '',
        family: vegFormFamily,
        sowingPeriod: vegFormSowingPeriod,
        plantingPeriod: vegFormPlantingPeriod,
        cultureDuration: vegFormCultureDuration,
        plantSpacing: vegFormPlantSpacing || '', // Use new name
        rowSpacing: vegFormRowSpacing || '', // New field
        unitCost: parseFloat(vegFormUnitCost) || 0, // New field for unit cost
        costingUnit: vegFormCostingUnit, // New field for costing unit
      };

      if (editingVegId) {
        // Mise à jour du légume existant
        setVegetables(prevVegetables =>
          prevVegetables.map(veg => (veg.id === editingVegId ? { ...veg, ...vegData } : veg))
        );
        showCustomMessage('Succès', 'Légume modifié avec succès !', 'success');
        setEditingVegId(null);
      } else {
        // Ajout d'un nouveau légume avec un ID unique
        const newVeg = { ...vegData, id: Math.random().toString(36).substr(2, 9) };
        setVegetables(prevVegetables => {
          const updatedVegetables = [...prevVegetables, newVeg];
          updatedVegetables.sort((a, b) => a.name.localeCompare(b.name));
          return updatedVegetables;
        });
        showCustomMessage('Succès', 'Nouveau légume ajouté avec succès !', 'success');
      }
      resetVegetableForm();
    } catch (error) {
      console.error(`Erreur lors de l'ajout/modification du légume:`, error);
      showCustomMessage('Erreur', `Erreur lors de l'ajout/modification de la légume: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditVegetableClick = (veg) => {
    setEditingVegId(veg.id);
    setVegFormName(veg.name);
    setVegFormVariety(veg.variety || '');
    setVegFormFamily(veg.family);
    setVegFormSowingPeriod(veg.sowingPeriod);
    setVegFormPlantingPeriod(veg.plantingPeriod);
    setVegFormCultureDuration(veg.cultureDuration || '');
    setVegFormPlantSpacing(veg.plantSpacing || ''); // Load new name
    setVegFormRowSpacing(veg.rowSpacing || ''); // Load new field
    setVegFormUnitCost(veg.unitCost ? veg.unitCost.toString() : ''); // Load unit cost
    setVegFormCostingUnit(veg.costingUnit || 'plant'); // Load costing unit
    setActiveSection('vegetable_database'); // Ensure we are on the correct tab
  };

  const handleDeleteVegetableClick = (veg) => {
    setItemToDelete({ id: veg.id, type: 'vegetable', name: veg.name });
    setShowConfirmModal(true);
  };

  const handleCancelVegetableEdit = () => {
    setEditingVegId(null);
    resetVegetableForm();
  };

  const resetVegetableForm = () => {
    setVegFormName('');
    setVegFormVariety('');
    setVegFormFamily('');
    setVegFormSowingPeriod('');
    setVegFormPlantingPeriod('');
    setVegFormCultureDuration('');
    setVegFormPlantSpacing(''); // Reset new name
    setVegFormRowSpacing(''); // Reset new field
    setVegFormUnitCost(''); // Reset unit cost
    setVegFormCostingUnit('plant'); // Reset costing unit
  };

  // --- Fonctions de sélection pour la suppression en masse des légumes ---
  const handleSelectAllVegetables = (e) => {
    if (e.target.checked) {
      // Select all filtered vegetables
      const allFilteredVegIds = filteredVegetables.map(veg => veg.id);
      setSelectedVegetables(allFilteredVegIds);
    } else {
      // Deselect all
      setSelectedVegetables([]);
    }
  };

  const handleSelectVegetable = (vegId) => {
    setSelectedVegetables(prevSelected => {
      if (prevSelected.includes(vegId)) {
        return prevSelected.filter(id => id !== vegId);
      } else {
        return [...prevSelected, vegId];
      }
    });
  };

  // --- Fonction pour la suppression en masse des légumes ---
  const handleBulkDeleteVegetables = () => {
    if (selectedVegetables.length === 0) {
      showCustomMessage('Aucune sélection', 'Veuillez sélectionner au moins un légume à supprimer.', 'info');
      return;
    }
    setItemToDelete({ id: 'bulk-delete', type: 'vegetable-bulk', count: selectedVegetables.length });
    setShowConfirmModal(true);
  };

  // --- Fonction de tri pour la Base de Données de Légumes ---
  const handleVegSort = (column) => {
    if (vegSortColumn === column) {
      setVegSortDirection(vegSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setVegSortColumn(column);
      setVegSortDirection('asc');
    }
  };


  // --- Fonctions pour la gestion des parcelles (Rotation) ---
  const handlePlotFamilyChange = (e) => {
      const selectedValue = e.target.value;
      if (selectedValue === "autre") {
          setIsCustomFamilyInputVisible(true);
          setPlotFormFamily(""); // Clear plotFormFamily, it will be set by customFamilyName input
          setCustomFamilyName(""); // Clear previous custom input
      } else {
          setIsCustomFamilyInputVisible(false);
          setPlotFormFamily(selectedValue);
          setCustomFamilyName("");
      }
  };

  const handleCustomFamilyNameChange = (e) => {
      setCustomFamilyName(e.target.value);
      setPlotFormFamily(e.target.value); // Set plotFormFamily to custom input
  };

  const handleAddOrUpdatePlot = (e) => {
      e.preventDefault();
      const finalFamily = isCustomFamilyInputVisible ? customFamilyName : plotFormFamily;
      if (!plotFormName.trim() || !finalFamily.trim()) {
          showCustomMessage('Champs obligatoires manquants', 'Veuillez renseigner le nom de la parcelle et la famille de légumes associée.', 'error');
          return;
      }

      setIsLoading(true);
      try {
          const plotData = {
              name: plotFormName.trim(),
              assignedFamily: finalFamily.trim(),
              notes: plotFormNotes.trim() || '',
              bedSize: plotFormBedSize || '', // Save new field
              numberOfBeds: parseInt(plotFormNumberOfBeds) || 0, // Save new field
              area: plotFormArea // Save calculated area
          };

          if (editingPlotId) {
              // Get the old plot data to compare changes
              const oldPlot = plots.find(p => p.id === editingPlotId);
              if (!oldPlot) {
                  showCustomMessage('Erreur', 'Parcelle introuvable pour la modification.', 'error');
                  setIsLoading(false);
                  return;
              }

              // Check if family is being changed and if crops are associated
              if (oldPlot.assignedFamily !== finalFamily) {
                  const cropsAssociatedWithThisPlot = crops.some(crop => crop.plotId === editingPlotId);
                  if (cropsAssociatedWithThisPlot) {
                      const errorMessage = `La famille ne peut pas être modifiée car des cultures sont associées à cette parcelle. Veuillez supprimer ou déplacer les cultures d'abord.`;
                      showCustomMessage('Modification impossible', errorMessage, 'error');
                      setIsLoading(false);
                      return;
                  }
              }

              // Update the plot
              setPlots(prevPlots =>
                prevPlots.map(plot => (plot.id === editingPlotId ? { ...plot, ...plotData } : plot))
              );

              // Update associated crops if plot name, bedSize, numberOfBeds or area changed
              const nameChanged = oldPlot.name !== plotData.name;
              const bedSizeChanged = oldPlot.bedSize !== plotData.bedSize;
              const numberOfBedsChanged = oldPlot.numberOfBeds !== plotData.numberOfBeds;
              const areaChanged = oldPlot.area !== plotData.area;

              if (nameChanged || bedSizeChanged || numberOfBedsChanged || areaChanged) {
                  setCrops(prevCrops =>
                      prevCrops.map(crop => {
                          if (crop.plotId === editingPlotId) {
                              const updatedCrop = {
                                  ...crop,
                                  plot: nameChanged ? plotData.name : crop.plot,
                                  bedSize: bedSizeChanged ? plotData.bedSize : crop.bedSize,
                                  numberOfBeds: numberOfBedsChanged ? plotData.numberOfBeds : crop.numberOfBeds,
                                  plotArea: areaChanged ? plotData.area : crop.plotArea,
                              };

                              // Recalculate rowsPerBed and numberOfPlants for this specific crop
                              const bedWidth = getBedWidth(updatedCrop.bedSize);
                              const selectedVegForRecalc = vegetables.find(v => v.name === updatedCrop.name && (v.variety || '') === (updatedCrop.variety || ''));

                              let recalculatedRowsPerBed = 1;
                              if (bedWidth > 0 && selectedVegForRecalc && parseFloat(selectedVegForRecalc.rowSpacing) > 0) {
                                  let tempCalculatedRows = bedWidth / parseFloat(selectedVegForRecalc.rowSpacing);
                                  recalculatedRowsPerBed = Math.floor(tempCalculatedRows >= 1 ? tempCalculatedRows : 1);
                              }
                              updatedCrop.rowsPerBed = recalculatedRowsPerBed;

                              const numBeds = updatedCrop.numberOfBeds || 0;
                              const spacingVal = selectedVegForRecalc ? parseFloat(selectedVegForRecalc.plantSpacing) : 0;
                              const bedLength = getBedLength(updatedCrop.bedSize);
                              let recalculatedNumberOfPlants = 0;
                              if (numBeds > 0 && bedLength > 0 && spacingVal > 0 && recalculatedRowsPerBed > 0) {
                                  recalculatedNumberOfPlants = numBeds * (bedLength / spacingVal) * recalculatedRowsPerBed;
                              }
                              updatedCrop.numberOfPlants = Math.floor(recalculatedNumberOfPlants);

                              return updatedCrop;
                          }
                          return crop;
                      })
                  );
              }

              showCustomMessage('Succès', 'Parcelle modifiée avec succès !', 'success');
              setEditingPlotId(null);
          } else {
              // Ajout d'une nouvelle parcelle avec un ID unique
              const newPlot = { ...plotData, id: Math.random().toString(36).substr(2, 9) };
              setPlots(prevPlots => {
                const updatedPlots = [...prevPlots, newPlot];
                updatedPlots.sort((a, b) => a.name.localeCompare(b.name));
                return updatedPlots;
              });
              showCustomMessage('Succès', 'Nouvelle parcelle ajoutée avec succès !', 'success');
          }
          resetPlotForm();
      }
      catch (error) {
          console.error(`Erreur lors de l'ajout/modification de la parcelle:`, error);
          showCustomMessage('Erreur', `Erreur lors de l'ajout/modification de la parcelle: ${error.message}`, 'error');
      } finally {
          setIsLoading(false);
      }
  };

  const handleEditPlotClick = (plot) => {
      setEditingPlotId(plot.id);
      setPlotFormName(plot.name);
      setPlotFormNotes(plot.notes || '');
      setPlotFormBedSize(plot.bedSize || ''); // Load new field
      setPlotFormNumberOfBeds(plot.numberOfBeds ? plot.numberOfBeds.toString() : ''); // Load new field
      setPlotFormArea(plot.area || 0); // Load area for display

      // Determine if family change should be disabled
      const hasAssociatedCrops = crops.some(crop => crop.plotId === plot.id);
      setIsPlotFamilyChangeDisabled(hasAssociatedCrops); // Corrected typo: hasAssociatedCops -> hasAssociatedCrops

      // Check if the assignedFamily is in the uniqueVegetableFamilies list
      if (uniqueVegetableFamilies.includes(plot.assignedFamily)) {
          setPlotFormFamily(plot.assignedFamily);
          setIsCustomFamilyInputVisible(false);
          setCustomFamilyName('');
      } else {
          setPlotFormFamily('autre'); // Set dropdown to "Autre"
          setIsCustomFamilyInputVisible(true);
          setCustomFamilyName(plot.assignedFamily); // Populate custom input
      }
      setActiveSection('rotation');
  };

  const handleDeletePlotClick = (plot) => {
    setItemToDelete({ id: plot.id, type: 'plot', name: plot.name });
    setShowConfirmModal(true);
  };

  // --- Gère le clic sur le bouton "Dupliquer (ouvre le modal) pour les parcelles ---
  const handleDuplicatePlotClick = (plot) => {
    setPlotToDuplicate(plot);
    setNumberOfPlotCopies(1); // Default to 1 copy
    setShowDuplicatePlotModal(true);
  };

  // --- Confirme et exécute la duplication (pour plusieurs copies) de parcelle ---
  const confirmDuplicatePlotAction = () => {
    if (!plotToDuplicate || numberOfPlotCopies <= 0) {
        showCustomMessage('Erreur de duplication', 'Impossible de dupliquer. Des informations essentielles sont manquantes.', 'error');
        resetDuplicatePlotModal();
        return;
    }

    setIsLoading(true);
    try {
        const originalBaseName = plotToDuplicate.name.replace(/ (\d+)$/, '');
        const newPlots = [];
        let highestExistingSuffix = 0;

        // Find the highest existing suffix for the base name
        plots.forEach(p => {
            const match = p.name.match(new RegExp(`^${originalBaseName}(?: (\\d+))?$`));
            if (match) {
                const currentSuffix = match[1] ? parseInt(match[1]) : (p.name === originalBaseName ? 0 : NaN);
                if (!isNaN(currentSuffix)) {
                    highestExistingSuffix = Math.max(highestExistingSuffix, currentSuffix);
                }
            }
        });

        let currentSuffixForNewCopies = highestExistingSuffix + 1;
        const generatedNamesInBatch = new Set(); // Keep track of names generated in *this batch*

        for (let i = 0; i < numberOfPlotCopies; i++) {
            let newName = `${originalBaseName} ${currentSuffixForNewCopies}`;
            // Ensure uniqueness within the existing plots and within the current batch of new plots
            while (plots.some(p => p.name === newName) || generatedNamesInBatch.has(newName)) {
                currentSuffixForNewCopies++;
                newName = `${originalBaseName} ${currentSuffixForNewCopies}`;
            }

            const duplicatedPlotData = {
                ...plotToDuplicate,
                name: newName,
                id: Math.random().toString(36).substr(2, 9), // Génère un nouvel ID unique localement
            };
            newPlots.push(duplicatedPlotData);
            generatedNamesInBatch.add(newName);
            currentSuffixForNewCopies++;
        }

        setPlots(prevPlots => {
            const updatedPlots = [...prevPlots, ...newPlots];
            updatedPlots.sort((a, b) => a.name.localeCompare(b.name));
            return updatedPlots;
        });

        showCustomMessage('Duplication réussie !', `${numberOfPlotCopies} copies de "${plotToDuplicate.name}" ont été créées avec succès !`, 'success');
        resetDuplicatePlotModal();
    } catch (error) {
        console.error(`Erreur critique lors de la duplication des parcelles:`, error);
        showCustomMessage('Échec de la duplication', `Erreur : ${error.message}.`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const resetDuplicatePlotModal = () => {
    setShowDuplicatePlotModal(false);
    setPlotToDuplicate(null);
    setNumberOfPlotCopies(1);
  };


  const handleCancelPlotEdit = () => {
      setEditingPlotId(null);
      resetPlotForm();
  };

  const resetPlotForm = () => {
      setPlotFormName('');
      setPlotFormFamily('');
      setPlotFormNotes('');
      setPlotFormBedSize(''); // Reset new field
      setPlotFormNumberOfBeds(''); // Reset new field
      setPlotFormArea(0); // Reset area
      setEditingPlotId(null);
      setIsCustomFamilyInputVisible(false);
      setCustomFamilyName('');
      setIsPlotFamilyChangeDisabled(false); // Reset disabled state
  };

  // --- Fonction de tri pour les parcelles ---
  const handlePlotSort = (column) => {
    if (plotSortColumn === column) {
      setPlotSortDirection(plotSortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setPlotSortColumn(column);
      setPlotSortDirection('asc');
    }
  };


  // --- Confirme et exécute la suppression (pour culture, récolte, légume ou parcelle) ---
  const confirmDeleteAction = () => {
    if (!itemToDelete) return;

    setIsLoading(true);
    try {
      if (itemToDelete.type === 'crop') {
        setCrops(prevCrops => prevCrops.filter(crop => crop.id !== itemToDelete.id));
        const successMessage = `La culture "${itemToDelete.name}" a été supprimée.`;
        showCustomMessage('Succès', successMessage, 'success');
      } else if (itemToDelete.type === 'harvest') {
        setHarvests(prevHarvests => prevHarvests.filter(harvest => harvest.id !== itemToDelete.id));
        const successMessage = `La récolte de "${itemToDelete.name}" du ${itemToDelete.date} a été supprimée.`;
        showCustomMessage('Succès', successMessage, 'success');
      } else if (itemToDelete.type === 'vegetable') {
        setVegetables(prevVegetables => prevVegetables.filter(veg => veg.id !== itemToDelete.id));
        const successMessage = `Le légume "${itemToDelete.name}" a été supprimé de la base de données.`;
        showCustomMessage('Succès', successMessage, 'success');
      } else if (itemToDelete.type === 'plot') {
          // Before deleting a plot, check if any crops are associated
          const cropsAssociatedWithThisPlot = crops.filter(crop => crop.plotId === itemToDelete.id);
          if (cropsAssociatedWithThisPlot.length > 0) {
              const errorMessage = `La parcelle "${itemToDelete.name}" ne peut pas être supprimée car ${cropsAssociatedWithThisPlot.length} culture(s) y sont encore associées. Veuillez supprimer ou déplacer ces cultures d'abord.`;
              showCustomMessage('Suppression impossible', errorMessage, 'error');
              setShowConfirmModal(false); // Close modal without deleting
              setIsLoading(false);
              return;
          }
          setCrops(prevCrops => prevCrops.filter(crop => crop.plotId !== itemToDelete.id)); // Also remove crops associated with this plot
          setPlots(prevPlots => prevPlots.filter(plot => plot.id !== itemToDelete.id));
          const successMessage = `La parcelle "${itemToDelete.name}" a été supprimée.`;
          showCustomMessage('Succès', successMessage, 'success');
      } else if (itemToDelete.type === 'vegetable-bulk') {
        setVegetables(prevVegetables => prevVegetables.filter(veg => !selectedVegetables.includes(veg.id)));
        const successMessage = `${itemToDelete.count} légumes sélectionnés ont été supprimés de la base de données.`;
        showCustomMessage('Succès', successMessage, 'success');
        setSelectedVegetables([]); // Clear selection after bulk delete
      }
      setItemToDelete(null);
      setShowConfirmModal(false);
    } catch (error) {
      console.error(`Erreur lors de la suppression:`, error);
      showCustomMessage('Erreur', `Erreur lors de la suppression: ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Annule la suppression et ferme le modal ---
  const cancelDelete = () => {
    setItemToDelete(null);
    setShowConfirmModal(false);
  };

  // --- Fonction utilitaire pour obtenir le titre du marqueur de calendrier ---
  const getMarkerTitle = (markerType) => {
    switch (markerType) {
      case 'S': return 'semis';
      case 'P': return 'plantation';
      case 'R-start': return 'début de récolte';
      case 'R-end': return 'fin de récolte';
      default: return '';
    }
  };

  // --- Gère le clic sur un marqueur de date dans le calendrier ---
  const handleCalendarMarkerClick = (cropId, markerType) => {
    const cropToEdit = crops.find(c => c.id === cropId);
    if (cropToEdit) {
      handleEditCropClick(cropToEdit); // Pré-remplit le formulaire et change de section

      let fieldToFocus = null;
      if (markerType === 'S') fieldToFocus = 'cropFormTypicalSowingDate';
      else if (markerType === 'P') fieldToFocus = 'cropFormTypicalPlantingDate';
      else if (markerType === 'R-start') fieldToFocus = 'cropFormTypicalHarvestStartDate';
      else if (markerType === 'R-end') fieldToFocus = 'cropFormTypicalHarvestEndDate';

      setFocusInputField(fieldToFocus); // Définit le champ à focaliser
    }
  };

  // --- Gère le clic sur le nom de la culture dans le calendrier ---
  const handleCalendarCropNameClick = (cropId) => {
    const cropToEdit = crops.find(c => c.id === cropId);
    if (cropToEdit) {
      handleEditCropClick(cropToEdit); // Pré-remplit le formulaire et change de section
      setFocusInputField(null); // Pas de champ spécifique à focaliser, juste le formulaire
    }
  };

  // --- Fonctions utilitaires pour le calendrier (avec gestion des semaines) ---

  /**
   * Normalise une chaîne de date and MM-DD en un objet Date avec une année fixe (2000).
   * Utile pour comparer les mois et jours sans se soucier de l'année réelle.
   * @param {string} dateStr - La date en formatYYYY-MM-DD.
   * @returns {Date|null} Un objet Date normalisé ou null si la chaîne est vide.
   */
  const normalizeDate = (dateStr) => {
    if (!dateStr) return null;
    const parts = dateStr.split('-');
    if (parts.length === 3) { // AssumingYYYY-MM-DD
        return new Date(2000, parseInt(parts[1]) - 1, parseInt(parts[2]));
    }
    // Fallback for just MM-DD or other partial formats if they were used elsewhere
    try {
        const date = new Date(dateStr);
        if (!isNaN(date.getTime())) { // Check if date is valid
            return new Date(2000, date.getMonth(), date.getDate());
        }
    } catch (e) {
        console.warn(`Could not parse date string:`, dateStr, e);
    }
    return null;
  };

  /**
   * Détermine les marqueurs (S, P, R) et les classes de surlignage pour une semaine donnée d'une culture.
   * @param {object} crop - L'objet culture.
   * @param {number} monthIndex - L'index du mois (0-11).
   * @param {number} weekIndex - L'index de la semaine dans le mois (0-3 pour S1, S2, S3, S4).
   * @returns {{displayMarkers: Array<{type: string, label: string, date: Date}>, highlightClass: string}} Les marqueurs et la classe CSS de surlignage.
   */
  const getWeekInfo = (crop, monthIndex, weekIndex) => {
    // Jours de début et de fin approximatifs pour chaque "semaine" du mois
    const weekStartDayMapping = [1, 8, 16, 24];
    const weekEndDayMapping = [7, 15, 23, 31];

    const currentWeekStartDay = weekStartDayMapping[weekIndex];
    const currentWeekEndDay = weekEndDayMapping[weekIndex];

    let markers = []; // Ceci contiendra des objets marqueurs avec leur type et libellé
    let isRedHighlighted = false;
    let isGreenHighlighted = false;
    let isYellowHighlighted = false; // Nouveau surlignage jaune

    // Normalisation des dates pour des comparaisons sans tenir compte de l'année
    const sowingDate = normalizeDate(crop.typicalSowingDate);
    const plantingDate = normalizeDate(crop.typicalPlantingDate);
    const harvestStartDate = normalizeDate(crop.typicalHarvestStartDate);
    const harvestEndDate = normalizeDate(crop.typicalHarvestEndDate);

    // Fonction auxiliaire pour vérifier si un jour donné est dans la "semaine" courante
    const isDateInCurrentWeekCell = (dateObj) => {
      if (!dateObj || dateObj.getMonth() !== monthIndex) return false;
      const dayOfMonth = dateObj.getDate();
      return dayOfMonth >= currentWeekStartDay && dayOfMonth <= currentWeekEndDay;
    };

    // --- Détermination des Marqueurs (S, P, R) ---

    // Marqueur de Semis (S)
    if (sowingDate && isDateInCurrentWeekCell(sowingDate)) {
      markers.push({ type: 'S', label: 'S', date: sowingDate });
    }

    // Marqueur de Plantation (P)
    if (plantingDate && isDateInCurrentWeekCell(plantingDate)) {
      markers.push({ type: 'P', label: 'P', date: plantingDate });
    }

    // Marqueur pour la Date de Début de Récolte (R)
    if (harvestStartDate && isDateInCurrentWeekCell(harvestStartDate)) {
      const hasRStartInThisCell = markers.some(m => m.type === 'R-start' && m.date.toDateString() === harvestStartDate.toDateString());
      if (!hasRStartInThisCell) {
          markers.push({ type: 'R-start', label: 'R', date: harvestStartDate });
      }
    }

    // Marqueur pour la Date de Fin de Récolte (R)
    if (harvestEndDate && isDateInCurrentWeekCell(harvestEndDate)) {
        const isHarvestStartAndEndSameDate = harvestStartDate && harvestEndDate && harvestStartDate.toDateString() === harvestEndDate.toDateString();
        const hasRStartSameDay = markers.some(m => m.type === 'R-start' && m.date.toDateString() === harvestEndDate.toDateString());

        if (!isHarvestStartAndEndSameDate || !hasRStartSameDay) {
            markers.push({ type: 'R-end', label: 'R', date: harvestEndDate });
        }
    }


    // --- Détermination des Surlignages ---

    // Surlignage Rouge pour la Période de Récolte
    if (harvestStartDate && harvestEndDate) {
      for (let day = currentWeekStartDay; day <= currentWeekEndDay; day++) {
        const tempDate = new Date(2000, monthIndex, day);
        if (tempDate.getMonth() !== monthIndex) continue;

        if (harvestStartDate <= harvestEndDate) {
          if (tempDate >= harvestStartDate && tempDate <= harvestEndDate) {
            isRedHighlighted = true;
            break;
          }
        } else {
          // Handle wrap around year (e.g., Dec-Feb)
          if ((tempDate >= harvestStartDate && tempDate.getMonth() >= harvestStartDate.getMonth()) ||
              (tempDate <= harvestEndDate && tempDate.getMonth() <= harvestEndDate.getMonth())) {
            isRedHighlighted = true;
            break;
          }
        }
      }
    } else if (harvestStartDate && isDateInCurrentWeekCell(harvestStartDate)) {
      isRedHighlighted = true;
    }


    // Surlignage Vert pour la Période de Semis/Plantation à Plantation
    let greenPeriodStartEffective = sowingDate;
    if (!greenPeriodStartEffective && plantingDate) {
      greenPeriodStartEffective = plantingDate;
    }

    if (greenPeriodStartEffective && plantingDate) {
      for (let day = currentWeekStartDay; day <= currentWeekEndDay; day++) {
        const tempDate = new Date(2000, monthIndex, day);
        if (tempDate.getMonth() !== monthIndex) continue;

        if (greenPeriodStartEffective <= plantingDate) {
          if (tempDate >= greenPeriodStartEffective && tempDate <= plantingDate) {
            isGreenHighlighted = true;
            break;
          }
        } else {
          // Handle wrap around year
          if ((tempDate >= greenPeriodStartEffective && tempDate.getMonth() >= greenPeriodStartEffective.getMonth()) ||
              (tempDate <= plantingDate && tempDate.getMonth() <= plantingDate.getMonth())) {
            isGreenHighlighted = true;
            break;
          }
        }
      }
    }

    // Surlignage Jaune pour la Période entre Plantation et Début Récolte
    if (plantingDate && harvestStartDate) {
      for (let day = currentWeekStartDay; day <= currentWeekEndDay; day++) {
        const tempDate = new Date(2000, monthIndex, day);
        if (tempDate.getMonth() !== monthIndex) continue;

        if (harvestStartDate > plantingDate) {
            if (tempDate > plantingDate && tempDate < harvestStartDate) {
              isYellowHighlighted = true;
              break;
            }
            if (plantingDate.getFullYear() < harvestStartDate.getFullYear()) {
                 if ((tempDate > plantingDate && tempDate.getMonth() >= plantingDate.getMonth()) ||
                     (tempDate < harvestStartDate && tempDate.getMonth() <= harvestStartDate.getMonth())) {
                     isYellowHighlighted = true;
                     break;
                 }
             }
        }
      }
    }


    // Priorité de surlignage : Rouge > Jaune > Vert
    let finalHighlightClass = '';
    if (isRedHighlighted) {
      finalHighlightClass = 'bg-red-200';
    } else if (isYellowHighlighted) {
      finalHighlightClass = 'bg-yellow-200';
    } else if (isGreenHighlighted) {
      finalHighlightClass = 'bg-green-200';
    }

    // Trie les marqueurs pour un affichage cohérent (ex: S, P, R-start, R-end)
    markers.sort((a, b) => {
        // Priorité de tri: type de marqueur (S, P, R-start, R-end)
        const order = { 'S': 1, 'P': 2, 'R-start': 3, 'R-end': 4 };
        return order[a.type] - order[b.type];
    });


    return { displayMarkers: markers, highlightClass: finalHighlightClass };
  };


  const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
  const monthsFull = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const weeksPerMonth = 4; // Nombre de semaines affichées par mois pour la granularité

  // --- Fonctions de sauvegarde et d'ouverture JSON (pour toutes les données de l'application) ---

  const handleExportAllDataJSON = () => {
    // Collecte toutes les données des états locaux
    const dataToSave = {
      crops: crops,
      harvests: harvests,
      vegetables: vegetables,
      plots: plots
    };

    const jsonString = JSON.stringify(dataToSave, null, 2); // Beautify JSON output
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `maraichere_data_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showCustomMessage('Succès', 'Toutes les données de l\'application ont été exportées (JSON) !', 'success');
    console.log("Données exportées avec succès.");
  };

  const handleImportAllDataJSONClick = () => {
    // Crée un input de type fichier dynamiquement et le clique
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json'; // N'accepter que les fichiers JSON

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFileToImportAll(file);
        setShowImportAllConfirmModal(true); // Afficher le modal de confirmation
      }
    };
    fileInput.click();
  };

  const confirmImportAllDataJSONAction = () => {
    if (!fileToImportAll) {
      showCustomMessage("Erreur d'importation", "Aucun fichier à importer.", "error");
      return;
    }

    setIsLoading(true);
    setShowImportAllConfirmModal(false); // Fermer le modal

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result);
        let plotAdjustmentsMade = false; // Flag to track if any plot data was adjusted

        // Process plots first to create a lookup map
        const importedPlots = importedData.plots ? importedData.plots.map(p => ({
            ...p,
            id: p.id || Math.random().toString(36).substr(2, 9), // Ensure ID exists
            bedSize: p.bedSize || '', // Ensure bedSize exists
            numberOfBeds: p.numberOfBeds || 0, // Ensure numberOfBeds exists
            area: p.area || 0 // Ensure area exists
        })).sort((a,b) => a.name.localeCompare(b.name)) : [];

        // Create a mutable copy of plots to add new ones discovered from crops
        let allPlots = [...importedPlots];
        const plotNameIdMap = new Map(allPlots.map(plot => [plot.name.toLowerCase(), plot.id]));
        const plotIdFamilyMap = new Map(allPlots.map(plot => [plot.id, plot.assignedFamily]));
        const plotIdBedSizeMap = new Map(allPlots.map(plot => [plot.id, plot.bedSize])); // New map for bedSize
        const plotIdNumberOfBedsMap = new Map(allPlots.map(plot => [plot.id, plot.numberOfBeds])); // New map for numberOfBeds
        const plotIdAreaMap = new Map(allPlots.map(plot => [plot.id, plot.area])); // New map for area

        // Process crops
        const processedCrops = importedData.crops ? importedData.crops.map(c => {
            let plotId = c.plotId;
            let assignedFamily = c.assignedFamily;
            let plotName = c.plot;
            let bedSize = c.bedSize; // Keep existing bedSize from crop if present
            let numberOfBeds = c.numberOfBeds; // Keep existing numberOfBeds from crop if present
            let plotArea = c.plotArea; // Keep existing plotArea from crop if present

            // If plotId is missing but plot name exists, try to find or create plot
            if (!plotId && plotName) {
                const lowerCasePlotName = plotName.toLowerCase();
                if (plotNameIdMap.has(lowerCasePlotName)) {
                    plotId = plotNameIdMap.get(lowerCasePlotName);
                    // Use existing family or default if not present in crop or plot
                    assignedFamily = plotIdFamilyMap.get(plotId) || assignedFamily || 'Inconnue';
                    bedSize = plotIdBedSizeMap.get(plotId) || bedSize || ''; // Get from plot if available
                    numberOfBeds = plotIdNumberOfBedsMap.get(plotId) || numberOfBeds || 0; // Get from plot if available
                    plotArea = plotIdAreaMap.get(plotId) || plotArea || 0; // Get from plot if available
                    if (!c.plotId || !c.assignedFamily || !c.bedSize || !c.numberOfBeds || !c.plotArea) plotAdjustmentsMade = true; // Mark adjustment
                } else {
                    // Create a new plot entry for this "untracked" plot
                    plotId = Math.random().toString(36).substr(2, 9);
                    assignedFamily = assignedFamily || 'Inconnue'; // Default family for new plot
                    // Use crop's bedSize/numberOfBeds/plotArea if available, otherwise default
                    bedSize = bedSize || '';
                    numberOfBeds = numberOfBeds || 0;
                    plotArea = 0;
                    const newPlot = { id: plotId, name: plotName, assignedFamily: assignedFamily, notes: 'Ajouté via importation de culture', bedSize: bedSize, numberOfBeds: numberOfBeds, area: plotArea };
                    allPlots.push(newPlot);
                    plotNameIdMap.set(lowerCasePlotName, plotId);
                    plotIdFamilyMap.set(plotId, assignedFamily);
                    plotIdBedSizeMap.set(plotId, bedSize); // Add to new map
                    plotIdNumberOfBedsMap.set(plotId, numberOfBeds); // Add to new map
                    plotIdAreaMap.set(plotId, plotArea); // Add to new map
                    plotAdjustmentsMade = true; // Mark adjustment
                }
            } else if (plotId) {
                // If plotId exists, ensure assignedFamily, bedSize, numberOfBeds, area are consistent with plot data
                const plotFromMap = allPlots.find(p => p.id === plotId);
                if (plotFromMap) {
                    if (assignedFamily !== plotFromMap.assignedFamily) {
                        assignedFamily = plotFromMap.assignedFamily;
                        plotAdjustmentsMade = true;
                    }
                    if (bedSize !== plotFromMap.bedSize) {
                        bedSize = plotFromMap.bedSize;
                        plotAdjustmentsMade = true;
                    }
                    if (numberOfBeds !== plotFromMap.numberOfBeds) {
                        numberOfBeds = plotFromMap.numberOfBeds;
                        plotAdjustmentsMade = true;
                    }
                    if (plotArea !== plotFromMap.area) {
                        plotArea = plotFromMap.area;
                        plotAdjustmentsMade = true;
                    }
                } else {
                    // PlotId exists but plot not found in importedPlots, might be a legacy or custom entry
                    // Keep existing crop data, but mark for adjustment if missing
                    if (!assignedFamily || !bedSize || !numberOfBeds || !plotArea) plotAdjustmentsMade = true;
                    assignedFamily = assignedFamily || 'Inconnue';
                    bedSize = bedSize || '';
                    numberOfBeds = numberOfBeds || 0;
                    plotArea = 0;
                }
            } else if (!plotId && !plotName) {
                // If both plotId and plotName are missing, default to 'N/A' or similar
                plotName = 'N/A';
                plotId = Math.random().toString(36).substr(2, 9); // Generate a dummy ID
                assignedFamily = 'Inconnue';
                bedSize = '';
                numberOfBeds = 0;
                plotArea = 0;
                plotAdjustmentsMade = true; // Mark adjustment
            }


            return {
                ...c,
                id: c.id || Math.random().toString(36).substr(2, 9), // Ensure crop ID exists
                plot: plotName, // Ensure plot name is set
                plotId: plotId, // Ensure plotId is set
                assignedFamily: assignedFamily, // Ensure assignedFamily is set
                bedSize: bedSize, // Ensure bedSize is set
                numberOfBeds: numberOfBeds, // Ensure numberOfBeds is set
                plotArea: plotArea // Ensure plotArea is set
            };
        }).sort((a,b) => a.name.localeCompare(b.name)) : [];

        // Update states with processed data
        setPlots(allPlots.sort((a,b) => a.name.localeCompare(b.name)));
        setCrops(processedCrops);
        setHarvests(importedData.harvests ? importedData.harvests.map(h => ({...h, id: h.id || Math.random().toString(36).substr(2, 9)})).sort((a,b) => new Date(b.harvestStartDate) - new Date(a.harvestStartDate)) : []);
        setVegetables(importedData.vegetables ? importedData.vegetables.map(v => ({
            ...v,
            id: v.id || Math.random().toString(36).substr(2, 9),
            unitCost: parseFloat(v.unitCost) || 0, // Ensure unitCost is parsed
            costingUnit: v.costingUnit || 'plant' // Ensure costingUnit is set
        })).sort((a,b) => a.name.localeCompare(b.name)) : []);


        let successMessage = 'Importation de toutes les données terminée avec succès !';
        if (plotAdjustmentsMade) {
            successMessage += '\nCertaines informations de parcelles manquantes ou incohérentes ont été ajustées automatiquement pour assurer la cohérence.';
            showCustomMessage('Importation avec ajustements', successMessage, 'info');
        } else {
            showCustomMessage('Succès', successMessage, 'success');
        }

      } catch (error) {
        console.error(`Erreur lors de l'importation du fichier JSON:`, error);
        showCustomMessage('Erreur', `Erreur lors de l'importation des données JSON: ${error.message}`, 'error');
      } finally {
        setIsLoading(false);
        setFileToImportAll(null); // Nettoyer le fichier en attente
      }
    };
    reader.onerror = (error) => {
      console.error(`Erreur lors de la lecture du fichier JSON:`, error);
      showCustomMessage('Erreur', `Erreur lors de la lecture du fichier JSON: ${error.message}`, 'error');
      setIsLoading(false);
      setFileToImportAll(null);
    };

    reader.readAsText(fileToImportAll);
  };

  const cancelImportAll = () => {
    setShowImportAllConfirmModal(false);
    setFileToImportAll(null);
  };


  // --- Fonctions d'exportation CSV (pour la base de données de légumes) ---
  const handleExportVegetablesCSV = () => {
    const headers = [
      "Nom",
      "Variété",
      "Famille",
      "Période de semis",
      "Période de plantation",
      "Durée de culture avant récolte",
      "Distance Plants (m)", // Renamed
      "Distance Lignes (m)", // New
      "Coût unitaire", // New
      "Unité de coût" // New
    ];

    // Helper to escape CSV values
    const escapeCsvValue = (value) => {
      if (value === null || value === undefined) return '';
      let stringValue = String(value);
      // If the value contains a comma, semicolon, or double quote, enclose it in double quotes
      // and escape any existing double quotes by doubling them.
      if (stringValue.includes(';') || stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    };

    const csvRows = vegetables.map(veg => {
      return [
        escapeCsvValue(veg.name),
        escapeCsvValue(veg.variety),
        escapeCsvValue(veg.family),
        escapeCsvValue(veg.sowingPeriod),
        escapeCsvValue(veg.plantingPeriod),
        escapeCsvValue(veg.cultureDuration),
        escapeCsvValue(veg.plantSpacing), // Use new name
        escapeCsvValue(veg.rowSpacing), // New field
        escapeCsvValue(veg.unitCost), // New field
        escapeCsvValue(veg.costingUnit) // New field
      ].join(';'); // Use semicolon as delimiter
    });

    const csvContent = [
      headers.join(';'), // Join headers with semicolon
      ...csvRows
    ].join('\n'); // Join rows with newline

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `base_de_donnees_legumes_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showCustomMessage('Succès', 'Base de données des légumes exportée (CSV) avec succès !', 'success');
  };

  // --- Fonctions d'importation CSV (pour la base de données de légumes) ---
  const handleImportVegetablesCSVClick = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.csv';

    fileInput.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setFileToImportVegCSV(file);
        // Set default mode and show the confirmation modal
        setCsvImportMode('merge'); // Default to merge
        setShowImportVegCSVConfirmModal(true);
      }
    };
    fileInput.click();
  };

  const confirmImportVegetablesCSVAction = () => {
    if (!fileToImportVegCSV) {
      showCustomMessage("Erreur d'importation", "Aucun fichier CSV à importer.", "error");
      return;
    }

    setIsLoading(true);
    setShowImportVegCSVConfirmModal(false);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target.result;
        const lines = csvContent.split(/\r\n|\n/).filter(line => line.trim() !== ''); // Handle different line endings and empty lines

        if (lines.length <= 1) { // 1 line for header, so <= 1 means no data
          showCustomMessage('Erreur', 'Le fichier CSV est vide ou ne contient que des en-têtes.', 'error');
          setIsLoading(false);
          return;
        }

        const headerLine = lines[0];
        // Try to detect delimiter (semicolon or comma)
        const delimiter = headerLine.includes(';') ? ';' : ',';

        const headers = headerLine.split(delimiter).map(h => h.trim().replace(/^"|"$/g, '')); // Remove quotes from headers

        // Map CSV headers to internal object keys
        const headerMap = {
          "Nom": "name",
          "Variété": "variety",
          "Famille": "family",
          "Période de semis": "sowingPeriod",
          "Période de plantation": "plantingPeriod",
          "Durée de culture avant récolte": "cultureDuration",
          "Distance Plants (m)": "plantSpacing", // Renamed
          "Distance Lignes (m)": "rowSpacing", // New
          "Coût unitaire": "unitCost", // New
          "Unité de coût": "costingUnit" // New
        };

        let newOrUpdatedVegetables = [];
        let updatedCount = 0;
        let addedCount = 0;

        if (csvImportMode === 'replace') {
            // REPLACE MODE: Clear existing and add all from CSV
            for (let i = 1; i < lines.length; i++) {
                const values = parseCsvLine(lines[i], delimiter);
                if (values.length !== headers.length) {
                    console.warn(`Ligne ${i + 1} ignorée : nombre de colonnes incohérent.`, lines[i]);
                    continue;
                }
                const vegDataFromCsv = {};
                headers.forEach((header, index) => {
                    const key = headerMap[header];
                    if (key) {
                        let value = values[index];
                        // Convert unitCost to float
                        if (key === 'unitCost') {
                            value = parseFloat(value) || 0;
                        }
                        vegDataFromCsv[key] = value;
                    }
                });
                newOrUpdatedVegetables.push({ ...vegDataFromCsv, id: Math.random().toString(36).substr(2, 9) });
                addedCount++;
            }
            setVegetables(newOrUpdatedVegetables.sort((a,b) => a.name.localeCompare(b.name)));
            showCustomMessage('Succès', `Importation CSV terminée ! ${addedCount} légume(s) importé(s).\nLa base de données a été remplacée.`, 'success');

        } else { // MERGE MODE (default)
            const existingVegetablesMap = new Map();
            vegetables.forEach(veg => {
                const key = `${veg.name.toLowerCase()}_${(veg.variety || '').toLowerCase()}`;
                existingVegetablesMap.set(key, veg.id); // Store ID for lookup
            });

            // Start with a copy of current vegetables to modify
            const currentVegetablesMutable = [...vegetables];

            for (let i = 1; i < lines.length; i++) {
                const values = parseCsvLine(lines[i], delimiter);
                if (values.length !== headers.length) {
                    console.warn(`Ligne ${i + 1} ignorée : nombre de colonnes incohérent.`, lines[i]);
                    continue;
                }

                const vegDataFromCsv = {};
                headers.forEach((header, index) => {
                    const key = headerMap[header];
                    if (key) {
                        let value = values[index];
                        // Convert unitCost to float
                        if (key === 'unitCost') {
                            value = parseFloat(value) || 0;
                        }
                        vegDataFromCsv[key] = value;
                    }
                });

                const lookupKey = `${vegDataFromCsv.name.toLowerCase()}_${(vegDataFromCsv.variety || '').toLowerCase()}`;
                const existingId = existingVegetablesMap.get(lookupKey);

                if (existingId) {
                    // Update existing vegetable by finding its index
                    const vegIndex = currentVegetablesMutable.findIndex(v => v.id === existingId);
                    if (vegIndex !== -1) {
                        currentVegetablesMutable[vegIndex] = { ...currentVegetablesMutable[vegIndex], ...vegDataFromCsv };
                        updatedCount++;
                    }
                } else {
                    // Add new vegetable
                    newOrUpdatedVegetables.push({ ...vegDataFromCsv, id: Math.random().toString(36).substr(2, 9) });
                    addedCount++;
                }
            }

            // Combine updated existing vegetables with newly added ones
            const finalVegetablesList = [...currentVegetablesMutable, ...newOrUpdatedVegetables];

            setVegetables(finalVegetablesList.sort((a,b) => a.name.localeCompare(b.name)));
            showCustomMessage('Succès', `Importation CSV terminée !\n${addedCount} nouveau(x) légume(s) ajouté(s).\n${updatedCount} légume(s) existant(s) mis à jour.`, 'success');
        }

      } catch (error) {
        console.error(`Erreur lors de l'importation du fichier CSV:`, error);
        showCustomMessage('Erreur', `Erreur lors de l'importation des données CSV: ${error.message}. Assurez-vous que le fichier est au format CSV valide et utilise le point-virgule comme séparateur.`, 'error');
      } finally {
        setIsLoading(false);
        setFileToImportVegCSV(null);
      }
    };
    reader.onerror = (error) => {
      console.error(`Erreur lors de la lecture du fichier CSV:`, error);
      showCustomMessage('Erreur', `Erreur lors de la lecture du fichier CSV: ${error.message}`, 'error');
      setIsLoading(false);
      setFileToImportVegCSV(null);
    };

    reader.readAsText(fileToImportVegCSV);
  };

  // Helper function to parse a CSV line, handling quoted fields
  const parseCsvLine = (line, delimiter) => {
    const result = [];
    let inQuote = false;
    let currentField = '';

    for (let i = 0; i < line.length; i++) {
      const char = line[i];

      if (char === '"') {
        if (inQuote && line[i + 1] === '"') { // Escaped double quote
          currentField += '"';
          i++;
        } else {
          inQuote = !inQuote;
        }
      } else if (char === delimiter && !inQuote) {
        result.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    result.push(currentField.trim()); // Add the last field
    return result;
  };

  const cancelImportVegCSV = () => {
    setShowImportVegCSVConfirmModal(false);
    setFileToImportVegCSV(null);
    setCsvImportMode('merge'); // Reset to default
  };


  // --- Logique de filtrage des cultures ---
  const filteredCrops = crops.filter(crop => {
    const lowerCaseCropFilterValue = cropFilterValue.toLowerCase();

    // Apply main filter
    let matchesMainFilter = true;
    if (cropFilterValue) {
        switch (cropFilterType) {
            case 'name':
                matchesMainFilter = crop.name.toLowerCase().includes(lowerCaseCropFilterValue);
                break;
            case 'variety':
                matchesMainFilter = (crop.variety || '').toLowerCase().includes(lowerCaseCropFilterValue);
                break;
            case 'plot':
                // If filtering by plot, filter by plotId
                matchesMainFilter = crop.plotId === cropFilterValue;
                break;
            default:
                matchesMainFilter = true;
        }
    }
    return matchesMainFilter;
  });

  // Logique de tri des cultures
  const sortedFilteredCrops = useMemo(() => {
    let sortableCrops = [...filteredCrops];
    if (cropSortColumn) {
      sortableCrops.sort((a, b) => {
        const aValue = a[cropSortColumn] || '';
        const bValue = b[cropSortColumn] || '';

        // Handle numeric sorting for 'numberOfPlants' and 'plotArea'
        if (cropSortColumn === 'numberOfPlants' || cropSortColumn === 'plotArea') {
          const numA = parseFloat(aValue);
          const numB = parseFloat(bValue);
          if (!isNaN(numA) && !isNaN(numB)) {
            return cropSortDirection === 'asc' ? numA - numB : numB - numA;
          }
        }

        // Default to string comparison for other columns
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return cropSortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }
    return sortableCrops;
  }, [filteredCrops, cropSortColumn, cropSortDirection]);


  // --- Logique de filtrage et de tri de la base de données de légumes ---
  const filteredVegetables = vegetables.filter(veg => {
    if (!vegFilterValue) return true; // Si pas de valeur de filtre, afficher tout

    const lowerCaseFilterValue = vegFilterValue.toLowerCase();

    switch (vegFilterType) {
      case 'name':
        return veg.name.toLowerCase().includes(lowerCaseFilterValue);
      case 'variety':
        return (veg.variety || '').toLowerCase().includes(lowerCaseFilterValue);
      case 'family':
        return veg.family.toLowerCase().includes(lowerCaseFilterValue);
      default:
        return true;
    }
  });

  const sortedFilteredVegetables = useMemo(() => {
    let sortableVegetables = [...filteredVegetables]; // Start with filtered data

    if (vegSortColumn) {
        sortableVegetables.sort((a, b) => {
            const aValue = a[vegSortColumn] || '';
            const bValue = b[vegSortColumn] || '';

            // Handle numeric sorting for 'plantSpacing', 'rowSpacing', 'unitCost'
            if (vegSortColumn === 'plantSpacing' || vegSortColumn === 'rowSpacing' || vegSortColumn === 'unitCost') {
                const numA = parseFloat(aValue);
                const numB = parseFloat(bValue);
                if (!isNaN(numA) && !isNaN(numB)) {
                    return vegSortDirection === 'asc' ? numA - numB : numB - numA;
                }
            }

            // Default to string comparison for other columns
            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return vegSortDirection === 'asc'
                    ? aValue.localeCompare(bValue)
                    : bValue.localeCompare(aValue);
            }
            // Fallback for mixed types or non-comparable (shouldn't happen for these fields)
            return 0;
        });
    }
    return sortableVegetables;
  }, [filteredVegetables, vegSortColumn, vegSortDirection]);

  // --- Logique de filtrage des parcelles ---
  const filteredPlots = plots.filter(plot => {
    const lowerCasePlotFilterValue = plotFilterValue.toLowerCase();
    if (!plotFilterValue) return true;

    switch (plotFilterType) {
      case 'name':
        return plot.name.toLowerCase().includes(lowerCasePlotFilterValue);
      case 'family':
        return plot.assignedFamily.toLowerCase().includes(lowerCasePlotFilterValue);
      default:
        return true;
    }
  });

  // Logique de tri des parcelles
  const sortedFilteredPlots = useMemo(() => {
    let sortablePlots = [...filteredPlots];
    if (plotSortColumn) {
      sortablePlots.sort((a, b) => {
        const aValue = a[plotSortColumn] || '';
        const bValue = b[plotSortColumn] || '';

        if (plotSortColumn === 'area' || plotSortColumn === 'numberOfBeds') {
          const numA = parseFloat(aValue);
          const numB = parseFloat(bValue);
          if (!isNaN(numA) && !isNaN(numB)) {
            return plotSortDirection === 'asc' ? numA - numB : numB - numA;
          }
        }

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return plotSortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }
        return 0;
      });
    }
    return sortablePlots;
  }, [filteredPlots, plotSortColumn, plotSortDirection]);


  // --- Gère le changement de la parcelle dans le formulaire de culture ---
  const handleCropFormPlotChange = (e) => {
    const selectedPlotId = e.target.value;
    setCropFormPlot(selectedPlotId);

    if (selectedPlotId === 'autre') {
      setIsCustomPlotInputVisible(true);
      setCustomPlotName('');
      setCustomPlotFamily('');
      setCropFormFamily(''); // Clear derived family for custom input
      setCropFormBedSize(''); // Clear bed size for custom input
      setCropFormNumberOfBeds(''); // Clear number of beds for custom input
    } else {
      setIsCustomPlotInputVisible(false);
      const selectedPlot = plots.find(p => p.id === selectedPlotId);
      if (selectedPlot) {
        setCropFormFamily(selectedPlot.assignedFamily);
        setCropFormBedSize(selectedPlot.bedSize || ''); // Set bed size from selected plot
        setCropFormNumberOfBeds(selectedPlot.numberOfBeds ? selectedPlot.numberOfBeds.toString() : ''); // Set number of beds from selected plot
      } else {
        setCropFormFamily(''); // Should not happen if logic is correct
        setCropFormBedSize('');
        setCropFormNumberOfBeds('');
      }
    }
    // IMPORTANT: Do NOT reset cropFormName or cropFormVariety here.
    // The user wants to preserve the crop when changing the plot.
    // setCropFormName(''); // REMOVED
    // setCropFormVariety(''); // REMOVED
    // setIsCustomCropNameInputVisible(false); // REMOVED
    // setCustomCropName(''); // REMOVED
  };

  // --- Gère le changement du nom de la culture dans le formulaire de culture ---
  const handleCropFormNameChange = (e) => {
    const selectedValue = e.target.value;
    setCropFormName(selectedValue); // Store selected value (name or 'autre')

    if (selectedValue === 'autre') {
        setIsCustomCropNameInputVisible(true);
        setCustomCropName('');
        setCropFormVariety(''); // Clear variety for custom input
    } else {
        setIsCustomCropNameInputVisible(false);
        const selectedVeg = vegetables.find(veg => veg.name === selectedValue && (cropFormFamily ? veg.family === cropFormFamily : true));
        if (selectedVeg) {
            setCropFormVariety(selectedVeg.variety || '');
            setCropFormSpacing(selectedVeg.plantSpacing || ''); // Set plant spacing from selected veg
        } else {
            setCropFormVariety(''); // Should not happen if selected from filtered list
            setCropFormSpacing('');
        }
    }
  };

  // --- Gère le changement du nom personnalisé de la culture ---
  const handleCustomCropNameChange = (e) => {
      setCustomCropName(e.target.value);
      // cropFormName remains 'autre'
  };


  // --- Filtrer les légumes pour le sélecteur de nom de culture ---
  const getFilteredVegetablesForCropName = () => {
    if (cropFormFamily) {
      return vegetables.filter(veg => veg.family === cropFormFamily).sort((a,b) => a.name.localeCompare(b.name));
    }
    return vegetables.sort((a,b) => a.name.localeCompare(b.name));
  };

  // --- Filtrer les parcelles pour le sélecteur de parcelle dans le formulaire de culture ---
  const getFilteredPlotsForCropForm = () => {
    if (cropFormFamily) {
      // Filter plots by family
      const filtered = plots.filter(plot => plot.assignedFamily === cropFormFamily);
      // Ensure the currently selected plot (if editing) is always available, even if its family somehow doesn't match
      // This is a fallback for data inconsistencies, but ideally, cropFormFamily should match the selected plot's family.
      if (editingCropId && cropFormPlot) {
        const currentCropPlot = plots.find(p => p.id === cropFormPlot);
        if (currentCropPlot && !filtered.some(p => p.id === currentCropPlot.id)) {
          filtered.push(currentCropPlot); // Add it if not already in the filtered list
        }
      }
      return filtered.sort((a,b) => a.name.localeCompare(b.name));
    }
    // If no cropFormFamily is set (e.g., new crop, or initial state), show all plots
    return plots.sort((a,b) => a.name.localeCompare(b.name));
  };


  // --- Logic for Add Crop from Calendar Modal ---
  const handleAddCropFromCalendarClick = (monthIndex, weekIndex) => {
    setCalendarModalMonthIndex(monthIndex);
    setCalendarModalWeekIndex(weekIndex);
    // Pre-select plot if calendar filter is set to a specific plot
    if (calendarFilterType === 'plot' && calendarFilterValue) {
      setCalendarModalSelectedPlotId(calendarFilterValue);
    } else {
      setCalendarModalSelectedPlotId(''); // Reset selected plot if no filter or filter is not by plot
    }
    setCalendarModalSelectedVegId(''); // Reset selected vegetable
    setShowAddFromCalendarModal(true);
  };

  const handleCalendarModalPlotChange = (e) => {
    setCalendarModalSelectedPlotId(e.target.value);
    setCalendarModalSelectedVegId(''); // Reset vegetable selection when plot changes
  };

  const handleCalendarModalVegChange = (e) => {
    setCalendarModalSelectedVegId(e.target.value);
  };

  const getFilteredVegetablesForCalendarModal = () => {
    if (!calendarModalSelectedPlotId || calendarModalMonthIndex === null) {
      return [];
    }

    const selectedPlot = plots.find(p => p.id === calendarModalSelectedPlotId);
    if (!selectedPlot) {
      return [];
    }

    const plotFamily = selectedPlot.assignedFamily;
    const currentMonthName = monthsFull[calendarModalMonthIndex]; // e.g., "Mars"

    return vegetables.filter(veg => {
      // 1. Filter by family
      if (veg.family !== plotFamily) {
        return false;
      }

      // 2. Filter by sowing or planting period
      const monthRegex = new RegExp(currentMonthName, 'i'); // Case-insensitive match for month name

      const isInSowingPeriod = veg.sowingPeriod && monthRegex.test(veg.sowingPeriod);
      const isInPlantingPeriod = veg.plantingPeriod && monthRegex.test(veg.plantingPeriod);

      return isInSowingPeriod || isInPlantingPeriod;
    }).sort((a, b) => a.name.localeCompare(b.name));
  };

  const handleConfirmAddCropFromCalendar = (e) => {
    e.preventDefault();
    if (!calendarModalSelectedPlotId || !calendarModalSelectedVegId) {
      showCustomMessage('Champs obligatoires manquants', 'Veuillez sélectionner une parcelle et un légume.', 'error');
      return;
    }

    setIsLoading(true);

    try {
      const selectedPlot = plots.find(p => p.id === calendarModalSelectedPlotId);
      const selectedVeg = vegetables.find(veg => veg.id === calendarModalSelectedVegId);

      if (!selectedPlot || !selectedVeg) {
        showCustomMessage('Erreur', 'Parcelle ou légume non trouvé. Veuillez réessayer.', 'error');
        setIsLoading(false);
        return;
      }

      // Determine a specific date from monthIndex and weekIndex
      const currentYear = new Date().getFullYear(); // Or a fixed year like 2000 for consistency with normalizeDate
      const weekStartDayMapping = [1, 8, 16, 24];
      const dayOfMonth = weekStartDayMapping[calendarModalWeekIndex] + 3; // Mid-point of the week

      const baseDate = new Date(currentYear, calendarModalMonthIndex, dayOfMonth);
      const formattedBaseDate = baseDate.toISOString().slice(0, 10); //YYYY-MM-DD

      let typicalSowingDate = '';
      let typicalPlantingDate = '';
      let typicalHarvestStartDate = '';
      let typicalHarvestEndDate = '';

      // Determine if it's primarily a sowing or planting month for the chosen veg
      const currentMonthName = monthsFull[calendarModalMonthIndex];
      const monthRegex = new RegExp(currentMonthName, 'i');
      const isInSowingPeriod = selectedVeg.sowingPeriod && monthRegex.test(selectedVeg.sowingPeriod);
      const isInPlantingPeriod = selectedVeg.plantingPeriod && monthRegex.test(selectedVeg.plantingPeriod);

      if (isInPlantingPeriod && selectedVeg.plantingPeriod !== 'N/A') {
        typicalPlantingDate = formattedBaseDate;
        // If there's also a sowing period for this month, assume sowing happens slightly before planting.
        if (isInSowingPeriod && selectedVeg.sowingPeriod !== 'N/A') {
            const sowingDay = Math.max(1, dayOfMonth - 7); // 1 week before planting
            typicalSowingDate = new Date(currentYear, calendarModalMonthIndex, sowingDay).toISOString().slice(0, 10);
        }
      } else if (isInSowingPeriod && selectedVeg.sowingPeriod !== 'N/A') {
        typicalSowingDate = formattedBaseDate;
        // If only sowing, estimate planting date based on culture duration or common practices if available
        // For simplicity, we'll set planting date to sowing date + 30 days if only sowing period is present
        const plantingEstDate = new Date(baseDate);
        plantingEstDate.setDate(baseDate.getDate() + 30); // Assume 30 days for seedling growth
        typicalPlantingDate = plantingEstDate.toISOString().slice(0, 10);
      } else {
          // Fallback if no specific period matched, use planting date as the clicked date.
          typicalPlantingDate = formattedBaseDate;
      }


      // Calculate harvest dates based on culture duration from planting date
      if (selectedVeg.cultureDuration && typicalPlantingDate && selectedVeg.cultureDuration.toLowerCase() !== 'vivace') {
        const plantingDateObj = new Date(typicalPlantingDate);
        const durationParts = selectedVeg.cultureDuration.toLowerCase().replace('jours', '').replace('mois', '').trim().split('-');
        let minDays = 0;
        let maxDays = 0;

        if (durationParts.length === 2) {
          minDays = parseInt(durationParts[0].trim());
          maxDays = parseInt(durationParts[1].trim());
        } else if (durationParts.length === 1 && !isNaN(parseInt(durationParts[0]))) {
          minDays = parseInt(durationParts[0].trim());
          maxDays = minDays;
        }

        // Convert months to days if the duration is in months (simple approximation)
        if (selectedVeg.cultureDuration.toLowerCase().includes('mois')) {
            minDays = minDays * 30;
            maxDays = maxDays * 30;
        }


        if (minDays > 0) {
          const harvestStart = new Date(plantingDateObj);
          harvestStart.setDate(plantingDateObj.getDate() + minDays);
          typicalHarvestStartDate = harvestStart.toISOString().slice(0, 10);

          const harvestEnd = new Date(plantingDateObj);
          harvestEnd.setDate(plantingDateObj.getDate() + maxDays);
          typicalHarvestEndDate = harvestEnd.toISOString().slice(0, 10);
        }
      }

      // Calculate rowsPerBed for new crop from calendar
      let calculatedRowsPerBed = 1; // Default
      const bedWidth = getBedWidth(selectedPlot.bedSize);
      const rowSpacing = selectedVeg.rowSpacing ? parseFloat(selectedVeg.rowSpacing) : 0;

      if (bedWidth > 0 && rowSpacing > 0) {
          let tempCalculatedRows = bedWidth / rowSpacing;
          if (tempCalculatedRows >= 1) {
              calculatedRowsPerBed = Math.floor(tempCalculatedRows);
          } else {
              calculatedRowsPerBed = 1;
          }
      }


      const newCrop = {
        id: Math.random().toString(36).substr(2, 9),
        name: selectedVeg.name,
        variety: selectedVeg.variety || '',
        typicalSowingDate: typicalSowingDate,
        typicalPlantingDate: typicalPlantingDate,
        typicalHarvestStartDate: typicalHarvestStartDate,
        typicalHarvestEndDate: typicalHarvestEndDate,
        bedSize: selectedPlot.bedSize || '', // Use bed size from selected plot
        numberOfBeds: selectedPlot.numberOfBeds || 0, // Use number of beds from selected plot
        rowsPerBed: calculatedRowsPerBed, // Use the calculated value
        spacing: selectedVeg.plantSpacing ? parseFloat(selectedVeg.plantSpacing) : 0, // Utilise l'espacement des plants de la base de données
        notes: '', // Changed to empty string as requested
        numberOfPlants: 0, // This will be recalculated by useEffect in crop form
        plot: selectedPlot.name,
        plotId: selectedPlot.id,
        assignedFamily: selectedPlot.assignedFamily,
        plotArea: selectedPlot.area || 0, // Store plot area
      };

      setCrops(prevCrops => {
        const updatedCrops = [...prevCrops, newCrop];
        updatedCrops.sort((a, b) => a.name.localeCompare(b.name));
        return updatedCrops;
      });

      showCustomMessage('Succès', `Nouvelle culture "${selectedVeg.name}" ajoutée à la parcelle "${selectedPlot.name}" !`, 'success');
      setShowAddFromCalendarModal(false);
    } catch (error) {
      console.error(`Erreur lors de l'ajout de la culture depuis le calendrier:`, error);
      showCustomMessage('Erreur', `Erreur lors de l'ajout : ${error.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelAddCropFromCalendar = () => {
    setShowAddFromCalendarModal(false);
    setCalendarModalSelectedPlotId('');
    setCalendarModalSelectedVegId('');
  };


  // Filtrer et trier les cultures pour le calendrier
  const filteredCropsForCalendar = crops.filter(crop => {
    const lowerCaseCalendarFilterValue = calendarFilterValue.toLowerCase();
    let matchesFilter = true;

    if (calendarFilterValue) {
        switch (calendarFilterType) {
            case 'name':
                matchesFilter = crop.name.toLowerCase().includes(lowerCaseCalendarFilterValue);
                break;
            case 'plot':
                // Filter by plot ID if filter value is a plot ID, otherwise by plot name
                const selectedPlotForFilter = plots.find(p => p.id === calendarFilterValue);
                if (selectedPlotForFilter) {
                    matchesFilter = crop.plotId === selectedPlotForFilter.id;
                } else {
                    // Fallback to name search if the filter value is not a valid plot ID
                    matchesFilter = crop.plot.toLowerCase().includes(lowerCaseCalendarFilterValue);
                }
                break;
            case 'family':
                matchesFilter = (crop.assignedFamily || '').toLowerCase().includes(lowerCaseCalendarFilterValue);
                break;
            default:
                matchesFilter = true;
        }
    }
    return matchesFilter;
  });

  const sortedFilteredCropsForCalendar = filteredCropsForCalendar.slice().sort((a, b) => {
      const dateA = normalizeDate(a.typicalPlantingDate);
      const dateB = normalizeDate(b.typicalPlantingDate);

      if (!dateA && !dateB) return 0;
      if (!dateA) return 1; // null dates go to the end
      if (!dateB) return -1; // null dates go to the end

      return dateA.getTime() - dateB.getTime();
  });

  // --- Logique d'agrégation pour le Chiffrage Cultures ---
  const aggregatedCostingData = useMemo(() => {
    const dataMap = new Map(); // Key: `${name}-${variety}`

    crops.forEach(crop => {
        const key = `${crop.name}-${crop.variety || ''}`;
        if (!dataMap.has(key)) {
            dataMap.set(key, {
                name: crop.name,
                variety: crop.variety || 'N/A',
                totalArea: 0,
                totalPlants: 0,
                unitCost: 0, // Will be populated from vegetables
                costingUnit: 'plant', // Will be populated from vegetables
                totalCalculatedCost: 0
            });
        }
        const currentData = dataMap.get(key);
        currentData.totalArea += crop.plotArea || 0;
        currentData.totalPlants += crop.numberOfPlants || 0;
    });

    // Now, populate unit cost and calculate total cost from vegetables DB
    dataMap.forEach((value, key) => {
        const matchingVeg = vegetables.find(veg =>
            veg.name === value.name && (veg.variety || '') === value.variety
        );
        if (matchingVeg) {
            value.unitCost = parseFloat(matchingVeg.unitCost) || 0;
            value.costingUnit = matchingVeg.costingUnit || 'plant';
        }

        // Calculate total cost: total plants * unit cost
        value.totalCalculatedCost = (value.totalPlants * value.unitCost).toFixed(2);
    });

    return Array.from(dataMap.values()).sort((a,b) => a.name.localeCompare(b.name));
  }, [crops, vegetables]);


  // --- Affichage du statut de chargement ---
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-100">
        <div className="flex items-center space-x-3 text-green-700 text-xl">
          <svg className="animate-spin h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Chargement de l'application...</span>
        </div>
      </div>
    );
  }

  // --- Rendu de l'interface utilisateur ---
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto bg-white p-6 sm:p-10 rounded-xl shadow-2xl border border-gray-200">
        <h1 className="text-4xl font-extrabold text-green-800 mb-6 text-center leading-tight flex items-center justify-center">
          <TreeDeciduous className="h-16 w-16 mr-4 text-green-700" /> {/* Icône d'arbre */}
          Ma ferme maraîchère
          <Carrot className="h-16 w-16 ml-4 text-orange-500" /> {/* Icône de carotte */}
        </h1>

        {/* Barre de navigation */}
        <nav className="mb-8 bg-green-100 rounded-lg p-3 shadow-inner flex flex-wrap justify-center gap-2 sm:gap-4">
          <button
            onClick={() => setActiveSection('dashboard')}
            className={`flex items-center py-2 px-4 rounded-md font-medium transition duration-200 ${
              activeSection === 'dashboard'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-green-800 hover:bg-green-200'
            }`}
          >
            <Home className="w-5 h-5 mr-1" /> Accueil
          </button>
          <button
            onClick={() => setActiveSection('rotation')}
            className={`flex items-center py-2 px-4 rounded-md font-medium transition duration-200 ${
              activeSection === 'rotation'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-green-800 hover:bg-green-200'
            }`}
          >
            <RotateCcw className="w-5 h-5 mr-1" /> Parcelles
          </button>
          <button
            onClick={() => setActiveSection('calendar')}
            className={`flex items-center py-2 px-4 rounded-md font-medium transition duration-200 ${
              activeSection === 'calendar'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-green-800 hover:bg-green-200'
            }`}
          >
            <CalendarDays className="w-5 h-5 mr-1" /> Calendrier
          </button>
          <button
            onClick={() => setActiveSection('cultures')}
            className={`flex items-center py-2 px-4 rounded-md font-medium transition duration-200 ${
              activeSection === 'cultures'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-green-800 hover:bg-green-200'
            }`}
          >
            <Sprout className="w-5 h-5 mr-1" /> Cultures
          </button>
          <button
            onClick={() => setActiveSection('recoltes')}
            className={`flex items-center py-2 px-4 rounded-md font-medium transition duration-200 ${
              activeSection === 'recoltes'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-green-800 hover:bg-green-200'
            }`}
          >
            <Apple className="w-5 h-5 mr-1" /> Récoltes
          </button>
          <button
            onClick={() => setActiveSection('vegetable_database')}
            className={`flex items-center py-2 px-4 rounded-md font-medium transition duration-200 ${
              activeSection === 'vegetable_database'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-green-800 hover:bg-green-200'
            }`}
          >
            <Database className="w-5 h-5 mr-1" /> Base de données
          </button>
          <button
            onClick={() => setActiveSection('chiffrage_cultures')}
            className={`flex items-center py-2 px-4 rounded-md font-medium transition duration-200 ${
              activeSection === 'chiffrage_cultures'
                ? 'bg-green-600 text-white shadow-md'
                : 'text-green-800 hover:bg-green-200'
            }`}
          >
            <Euro className="w-5 h-5 mr-1" /> Chiffrage
          </button>
        </nav>

        {/* --- Contenu des sections --- */}
        {activeSection === 'dashboard' && (
          <section className="text-center py-10">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">Bienvenue dans votre Gestionnaire de Cultures !</h2>
            <p className="text-gray-600 mb-6">
              Organisez et suivez vos cultures et récoltes maraîchères en toute simplicité.
            </p>
            <div className="mt-8 pt-8 border-t border-gray-200 flex justify-center space-x-4">
              <button
                onClick={handleExportAllDataJSON}
                className="bg-green-700 hover:bg-green-800 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
              >
                <Save className="w-5 h-5 mr-2" />
                Sauvegarder (JSON)
              </button>
              <button
                onClick={handleImportAllDataJSONClick}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
              >
                <Upload className="w-5 h-5 mr-2" />
                Ouvrir (JSON)
              </button>
            </div>
          </section>
        )}

        {activeSection === 'cultures' && (
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
              <Sprout className="h-8 w-8 text-green-600 mr-3" />
              Gestion des Cultures
            </h2>

            {/* Section de Filtrage */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <label htmlFor="cropFilterType" className="block text-gray-700 text-sm font-bold text-sm">Filtrer par :</label>
                <select
                    id="cropFilterType"
                    value={cropFilterType}
                    onChange={(e) => {
                        setCropFilterType(e.target.value);
                        setCropFilterValue(''); // Reset filter value when type changes
                    }}
                    className="shadow-sm border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                >
                    <option value="name">Nom de culture</option>
                    <option value="variety">Variété</option>
                    <option value="plot">Parcelle</option>
                </select>
                {cropFilterType === 'plot' ? (
                    <select
                        value={cropFilterValue}
                        onChange={(e) => setCropFilterValue(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded-lg w-full sm:w-auto flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    >
                        <option value="">Toutes les parcelles</option>
                        {plots.map(plot => (
                            <option key={plot.id} value={plot.id}>
                                {plot.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="text"
                        value={cropFilterValue}
                        onChange={(e) => setCropFilterValue(e.target.value)}
                        placeholder={`Rechercher par ${cropFilterType === 'name' ? 'nom' : cropFilterType === 'variety' ? 'variété' : 'parcelle'}...`}
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full sm:w-auto flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    />
                )}
            </div>


            {sortedFilteredCrops.length === 0 ? (
              <p className="text-gray-500 text-center italic">Aucune culture enregistrée ne correspond à votre filtre.</p>
            ) : (
              <div className="overflow-x-auto mb-8 rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-green-100 border-b border-green-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => setCropSortColumn('name')}>
                          Nom {cropSortColumn === 'name' && (cropSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => setCropSortColumn('variety')}>
                          Variété {cropSortColumn === 'variety' && (cropSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => setCropSortColumn('plot')}>
                          Parcelle {cropSortColumn === 'plot' && (cropSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => setCropSortColumn('assignedFamily')}>
                          Famille {cropSortColumn === 'assignedFamily' && (cropSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => setCropSortColumn('plotArea')}>
                          Superficie (m²) {cropSortColumn === 'plotArea' && (cropSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => setCropSortColumn('typicalSowingDate')}>
                          Semis {cropSortColumn === 'typicalSowingDate' && (cropSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => setCropSortColumn('typicalPlantingDate')}>
                          Plantation {cropSortColumn === 'typicalPlantingDate' && (cropSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => setCropSortColumn('typicalHarvestStartDate')}>
                          Début Récolte {cropSortColumn === 'typicalHarvestStartDate' && (cropSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => setCropSortColumn('typicalHarvestEndDate')}>
                          Fin Récolte {cropSortColumn === 'typicalHarvestEndDate' && (cropSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => setCropSortColumn('numberOfPlants')}>
                          Plants Est. {cropSortColumn === 'numberOfPlants' && (cropSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Notes</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedFilteredCrops.map((crop) => (
                      <tr key={crop.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{crop.name}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{crop.variety || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{crop.plot || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{crop.assignedFamily || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{crop.plotArea ? `${crop.plotArea} m²` : 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{crop.typicalSowingDate || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{crop.typicalPlantingDate || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{crop.typicalHarvestStartDate || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{crop.typicalHarvestEndDate || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{crop.numberOfPlants || '0'}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{crop.notes || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditCropClick(crop)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-200"
                              title="Modifier"
                            >
                              <PencilLine className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDuplicateCropClick(crop)}
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100 transition duration-200"
                              title="Dupliquer"
                            >
                              <Copy className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCropClick(crop)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition duration-200"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Formulaire d'ajout/modification de culture */}
            <div ref={cropFormRef} className="bg-green-50 p-6 rounded-xl shadow-lg border border-green-200">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">{editingCropId ? 'Modifier une Culture' : 'Ajouter une Nouvelle Culture'}</h3>
              <form onSubmit={handleAddOrUpdateCrop} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Famille de la culture (dérivée de la parcelle) */}
                <div>
                  <label htmlFor="cropFormFamily" className="block text-gray-700 text-sm font-bold mb-2">
                    Famille de légumes (dépend de la parcelle):
                  </label>
                  <input
                    type="text"
                    id="cropFormFamily"
                    value={cropFormFamily}
                    readOnly
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                    placeholder="Sélectionnez une parcelle pour définir la famille"
                  />
                </div>

                {/* Sélection de la parcelle */}
                <div>
                  <label htmlFor="cropFormPlot" className="block text-gray-700 text-sm font-bold mb-2">
                    Parcelle: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="cropFormPlot"
                    value={cropFormPlot}
                    onChange={handleCropFormPlotChange}
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    required
                  >
                    <option value="">Sélectionnez une parcelle</option>
                    {plots.map(plot => (
                      <option key={plot.id} value={plot.id}>
                        {plot.name} ({plot.assignedFamily})
                      </option>
                    ))}
                    <option value="autre">Autre (ajouter une nouvelle parcelle)</option>
                  </select>
                </div>

                {isCustomPlotInputVisible && (
                    <>
                        <div>
                            <label htmlFor="customPlotName" className="block text-gray-700 text-sm font-bold mb-2">
                                Nom de la nouvelle parcelle: <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="customPlotName"
                                value={customPlotName}
                                onChange={(e) => setCustomPlotName(e.target.value)}
                                className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                                placeholder="Ex: Parcelle 5"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="customPlotFamily" className="block text-gray-700 text-sm font-bold mb-2">
                                Famille de la nouvelle parcelle: <span className="text-red-500">*</span>
                            </label>
                            <select
                                id="customPlotFamily"
                                value={customPlotFamily}
                                onChange={(e) => setCustomPlotFamily(e.target.value)}
                                className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                                required
                            >
                                <option value="">Sélectionnez une famille</option>
                                {uniqueVegetableFamilies.map(family => (
                                    <option key={family} value={family}>{family}</option>
                                ))}
                                {/* Option pour ajouter une famille personnalisée n'est pas nécessaire ici car la liste est dérivée */}
                            </select>
                        </div>
                    </>
                )}

                {/* Nom de la culture */}
                <div>
                  <label htmlFor="cropFormName" className="block text-gray-700 text-sm font-bold mb-2">
                    Nom de la culture: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="cropFormName"
                    value={cropFormName}
                    onChange={handleCropFormNameChange}
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    required
                  >
                    <option value="">Sélectionnez un légume</option>
                    {getFilteredVegetablesForCropName().map(veg => (
                      <option key={veg.id} value={veg.name}>
                        {veg.name} {veg.variety && `(${veg.variety})`}
                      </option>
                    ))}
                    <option value="autre">Autre (saisir un nom personnalisé)</option>
                  </select>
                </div>

                {isCustomCropNameInputVisible && (
                    <div>
                        <label htmlFor="customCropName" className="block text-gray-700 text-sm font-bold mb-2">
                            Nom personnalisé de la culture: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="customCropName"
                            value={customCropName}
                            onChange={handleCustomCropNameChange}
                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                            placeholder="Ex: Tomate Coeur de Boeuf"
                            required
                        />
                    </div>
                )}

                {/* Variété */}
                <div>
                  <label htmlFor="cropFormVariety" className="block text-gray-700 text-sm font-bold mb-2">
                    Variété:
                  </label>
                  <input
                    type="text"
                    id="cropFormVariety"
                    value={cropFormVariety}
                    onChange={(e) => setCropFormVariety(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: Marmande"
                  />
                </div>

                {/* Dates */}
                <div>
                  <label htmlFor="cropFormTypicalSowingDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Date de semis (prévue):
                  </label>
                  <input
                    type="date"
                    id="cropFormTypicalSowingDate"
                    value={cropFormTypicalSowingDate}
                    onChange={(e) => setCropFormTypicalSowingDate(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  />
                </div>
                <div>
                  <label htmlFor="cropFormTypicalPlantingDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Date de plantation (prévue): <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="cropFormTypicalPlantingDate"
                    value={cropFormTypicalPlantingDate}
                    onChange={(e) => setCropFormTypicalPlantingDate(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cropFormTypicalHarvestStartDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Début de récolte (prévu): <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="cropFormTypicalHarvestStartDate"
                    value={cropFormTypicalHarvestStartDate}
                    onChange={(e) => setCropFormTypicalHarvestStartDate(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="cropFormTypicalHarvestEndDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Fin de récolte (prévue):
                  </label>
                  <input
                    type="date"
                    id="cropFormTypicalHarvestEndDate"
                    value={cropFormTypicalHarvestEndDate}
                    onChange={(e) => setCropFormTypicalHarvestEndDate(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  />
                </div>

                {/* Dimensions et espacement */}
                <div>
                  <label htmlFor="cropFormBedSize" className="block text-gray-700 text-sm font-bold mb-2">
                    Taille des planches (Lxl en m, ex: 10x1.2):
                  </label>
                  <input
                    type="text"
                    id="cropFormBedSize"
                    value={cropFormBedSize}
                    onChange={(e) => setCropFormBedSize(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: 10x1.2"
                  />
                </div>
                <div>
                  <label htmlFor="cropFormNumberOfBeds" className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre de planches:
                  </label>
                  <input
                    type="number"
                    id="cropFormNumberOfBeds"
                    value={cropFormNumberOfBeds}
                    onChange={(e) => setCropFormNumberOfBeds(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: 5"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="cropFormRowsPerBed" className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre de rangs par planche:
                  </label>
                  <input
                    type="text" // Changed to text as it's read-only
                    id="cropFormRowsPerBed"
                    value={cropFormRowsPerBed}
                    readOnly // Made read-only
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                    placeholder="Calculé automatiquement"
                  />
                </div>
                <div>
                  <label htmlFor="cropFormSpacing" className="block text-gray-700 text-sm font-bold mb-2">
                    Espacement entre plants (en m):
                  </label>
                  <input
                    type="number"
                    id="cropFormSpacing"
                    value={cropFormSpacing}
                    onChange={(e) => setCropFormSpacing(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: 0.3 (30cm)"
                    step="0.01"
                    min="0"
                  />
                </div>

                {/* Nombre de plants calculé */}
                <div>
                  <label htmlFor="cropFormNumberOfPlants" className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre de plants estimés:
                  </label>
                  <input
                    type="text"
                    id="cropFormNumberOfPlants"
                    value={cropFormNumberOfPlants}
                    readOnly
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label htmlFor="cropFormNotes" className="block text-gray-700 text-sm font-bold mb-2">
                    Notes:
                  </label>
                  <textarea
                    id="cropFormNotes"
                    value={cropFormNotes}
                    onChange={(e) => setCropFormNotes(e.target.value)}
                    rows="3"
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ajoutez des notes sur cette culture..."
                  ></textarea>
                </div>

                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
                  >
                    {editingCropId ? <PencilLine className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                    {editingCropId ? 'Modifier la Culture' : 'Ajouter la Culture'}
                  </button>
                  {editingCropId && (
                    <button
                      type="button"
                      onClick={handleCancelCropEdit}
                      className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
                    >
                      <X className="w-5 h-5 mr-2" /> Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}

        {activeSection === 'recoltes' && (
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
              <Apple className="h-8 w-8 text-green-600 mr-3" />
              Gestion des Récoltes
            </h2>

            {harvests.length === 0 ? (
              <p className="text-gray-500 text-center italic">Aucune récolte enregistrée.</p>
            ) : (
              <div className="overflow-x-auto mb-8 rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-green-100 border-b border-green-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Culture</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Variété</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Parcelle</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Début Récolte</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Fin Récolte</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Quantité Réelle</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Est. par Plant</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prix/Kg (€)</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Est. Totale</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Prix Est. Total (€)</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {harvests.map((harvest) => (
                      <tr key={harvest.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{harvest.cropName}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{harvest.variety || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{harvest.plot || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{harvest.harvestStartDate}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{harvest.harvestEndDate || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{harvest.actualQuantity} {harvest.unit}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{harvest.estimatedPerPlant} {harvest.estimatedPerPlantUnit}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{harvest.pricePerKg}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{harvest.totalEstimated} {harvest.totalEstimatedUnit}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{harvest.estimatedTotalPrice} €</td>
                        <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditHarvestClick(harvest)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-200"
                              title="Modifier"
                            >
                              <PencilLine className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteHarvestClick(harvest)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition duration-200"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Formulaire d'ajout/modification de récolte */}
            <div className="bg-green-50 p-6 rounded-xl shadow-lg border border-green-200">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">{editingHarvestId ? 'Modifier une Récolte' : 'Ajouter une Nouvelle Récolte'}</h3>
              <form onSubmit={handleAddOrUpdateHarvest} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="harvestFormCropId" className="block text-gray-700 text-sm font-bold mb-2">
                    Culture: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="harvestFormCropId"
                    value={harvestFormCropId}
                    onChange={(e) => setHarvestFormCropId(e.target.value)}
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    required
                  >
                    <option value="">Sélectionnez une culture</option>
                    {crops.map(crop => (
                      <option key={crop.id} value={crop.id}>
                        {crop.name} {crop.variety && `(${crop.variety})`} - {crop.plot}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="harvestFormPlot" className="block text-gray-700 text-sm font-bold mb-2">
                    Parcelle: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="harvestFormPlot"
                    value={harvestFormPlot}
                    onChange={(e) => setHarvestFormPlot(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Parcelle où la récolte a eu lieu"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="harvestFormStartDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Date de Début de Récolte: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    id="harvestFormStartDate"
                    value={harvestFormStartDate}
                    onChange={(e) => setHarvestFormStartDate(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="harvestFormEndDate" className="block text-gray-700 text-sm font-bold mb-2">
                    Fin de Récolte:
                  </label>
                  <input
                    type="date"
                    id="harvestFormEndDate"
                    value={harvestFormEndDate}
                    onChange={(e) => setHarvestFormEndDate(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <label htmlFor="harvestFormActualQuantity" className="block text-gray-700 text-sm font-bold mb-2">
                      Quantité réelle récoltée: <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      id="harvestFormActualQuantity"
                      value={harvestFormActualQuantity}
                      onChange={(e) => setHarvestFormActualQuantity(e.target.value)}
                      className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                      placeholder="Ex: 15.5"
                      step="0.01"
                      min="0"
                      required
                    />
                  </div>
                  <div className="flex-none">
                    <label htmlFor="harvestFormUnit" className="sr-only">Unité</label>
                    <select
                      id="harvestFormUnit"
                      value={harvestFormUnit}
                      onChange={(e) => setHarvestFormUnit(e.target.value)}
                      className="shadow-sm border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    >
                      <option value="Kg">Kg</option>
                      <option value="pièces">pièces</option>
                      <option value="litres">litres</option>
                    </select>
                  </div>
                </div>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <label htmlFor="harvestFormEstimatedPerPlant" className="block text-gray-700 text-sm font-bold mb-2">
                      Est. par plant:
                    </label>
                    <input
                      type="number"
                      id="harvestFormEstimatedPerPlant"
                      value={harvestFormEstimatedPerPlant}
                      onChange={(e) => setHarvestFormEstimatedPerPlant(e.target.value)}
                      className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                      placeholder="Ex: 0.5"
                      step="0.01"
                      min="0"
                    />
                  </div>
                  <div className="flex-none">
                    <label htmlFor="harvestFormEstimatedPerPlantUnit" className="sr-only">Unité par plant</label>
                    <select
                      id="harvestFormEstimatedPerPlantUnit"
                      value={harvestFormEstimatedPerPlantUnit}
                      onChange={(e) => setHarvestFormEstimatedPerPlantUnit(e.target.value)}
                      className="shadow-sm border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    >
                      <option value="Kg">Kg</option>
                      <option value="pièces">pièces</option>
                      <option value="litres">litres</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="harvestFormPricePerKg" className="block text-gray-700 text-sm font-bold mb-2">
                    Prix/Kg (€):
                  </label>
                  <input
                    type="number"
                    id="harvestFormPricePerKg"
                    value={harvestFormPricePerKg}
                    onChange={(e) => setHarvestFormPricePerKg(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: 2.50"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div className="flex items-end space-x-2">
                  <div className="flex-1">
                    <label htmlFor="harvestFormTotalEstimated" className="block text-gray-700 text-sm font-bold mb-2">
                      Récolte totale estimée:
                    </label>
                    <input
                      type="text"
                      id="harvestFormTotalEstimated"
                      value={harvestFormTotalEstimated}
                      readOnly
                      className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex-none">
                    <label htmlFor="harvestFormTotalEstimatedUnit" className="sr-only">Unité totale estimée</label>
                    <input
                      type="text"
                      id="harvestFormTotalEstimatedUnit"
                      value={harvestFormTotalEstimatedUnit}
                      readOnly
                      className="shadow-sm appearance-none border border-gray-300 rounded-lg py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="harvestFormEstimatedTotalPrice" className="block text-gray-700 text-sm font-bold mb-2">
                    Prix total estimé (€):
                  </label>
                  <input
                    type="text"
                    id="harvestFormEstimatedTotalPrice"
                    value={harvestFormEstimatedTotalPrice}
                    readOnly
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="harvestFormNotes" className="block text-gray-700 text-sm font-bold mb-2">
                    Notes:
                  </label>
                  <textarea
                    id="harvestFormNotes"
                    value={harvestFormNotes}
                    onChange={(e) => setHarvestFormNotes(e.target.value)}
                    rows="3"
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ajoutez des notes sur cette récolte..."
                  ></textarea>
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
                  >
                    {editingHarvestId ? <PencilLine className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                    {editingHarvestId ? 'Modifier la Récolte' : 'Ajouter la Récolte'}
                  </button>
                  {editingHarvestId && (
                    <button
                      type="button"
                      onClick={handleCancelHarvestEdit}
                      className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
                    >
                      <X className="w-5 h-5 mr-2" /> Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}

        {activeSection === 'calendar' && (
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
              <CalendarDays className="h-8 w-8 text-green-600 mr-3" />
              Calendrier des Cultures
            </h2>

            {/* Section de Filtrage du Calendrier (unifiée) */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <label htmlFor="calendarFilterType" className="block text-gray-700 text-sm font-bold text-sm">Filtrer par :</label>
                <select
                    id="calendarFilterType"
                    value={calendarFilterType}
                    onChange={(e) => {
                        setCalendarFilterType(e.target.value);
                        setCalendarFilterValue(''); // Reset filter value when type changes
                    }}
                    className="shadow-sm border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                >
                    <option value="name">Nom de culture</option>
                    <option value="plot">Parcelle</option>
                    <option value="family">Famille</option>
                </select>
                {calendarFilterType === 'plot' ? (
                    <select
                        value={calendarFilterValue}
                        onChange={(e) => setCalendarFilterValue(e.target.value)}
                        className="shadow-sm border border-gray-300 rounded-lg w-full sm:w-auto flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    >
                        <option value="">Toutes les parcelles</option>
                        {plots.map(plot => (
                            <option key={plot.id} value={plot.id}>
                                {plot.name}
                            </option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="text"
                        value={calendarFilterValue}
                        onChange={(e) => setCalendarFilterValue(e.target.value)}
                        placeholder={`Rechercher par ${calendarFilterType === 'name' ? 'nom' : calendarFilterType === 'plot' ? 'parcelle' : 'famille'}...`}
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full sm:w-auto flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    />
                )}
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
                <thead className="bg-green-100 border-b border-green-200">
                  <tr>
                    <th className="sticky left-0 bg-green-100 py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider z-10">Culture</th>
                    {months.map((month, monthIndex) => (
                      <th key={month} colSpan={weeksPerMonth} className="py-3 px-4 text-center text-xs font-medium text-gray-700 uppercase tracking-wider border-l border-green-200">
                        {month}
                      </th>
                    ))}
                  </tr>
                  <tr>
                    <th className="sticky left-0 bg-green-100 py-2 px-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider z-10 border-t border-green-200"></th>
                    {months.map((month, monthIndex) => (
                      <React.Fragment key={month + '-weeks'}>
                        {[...Array(weeksPerMonth)].map((_, weekIndex) => (
                          <th key={`${month}-S${weekIndex + 1}`} className="py-2 px-2 text-center text-xs font-medium text-gray-600 border-l border-green-200">
                            S{weekIndex + 1}
                          </th>
                        ))}
                      </React.Fragment>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedFilteredCropsForCalendar.length === 0 ? (
                    <tr>
                      <td colSpan={1 + months.length * weeksPerMonth} className="py-4 text-center text-gray-500 italic">
                        Aucune culture à afficher dans le calendrier.
                      </td>
                    </tr>
                  ) : (
                    sortedFilteredCropsForCalendar.map((crop) => (
                      <tr key={crop.id} className="hover:bg-gray-50">
                        <td
                          className="sticky left-0 bg-white py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900 z-10 border-r border-gray-200 cursor-pointer hover:text-green-700 hover:underline"
                        >
                            <div className="flex items-center justify-between">
                                <span onClick={() => handleCalendarCropNameClick(crop.id)}>
                                    {crop.name} {crop.variety && `(${crop.variety})`} - {crop.plot}
                                </span>
                                <button
                                    onClick={() => handleDeleteCropClick(crop)}
                                    className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 transition duration-200"
                                    title="Supprimer la culture"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </td>
                        {months.map((month, monthIndex) => (
                          <React.Fragment key={`${crop.id}-${month}`}>
                            {[...Array(weeksPerMonth)].map((_, weekIndex) => {
                              const { displayMarkers, highlightClass } = getWeekInfo(crop, monthIndex, weekIndex);
                              return (
                                <td
                                  key={`${crop.id}-${month}-S${weekIndex + 1}`}
                                  className={`py-2 px-2 text-center text-sm border-l border-gray-200 ${highlightClass} relative group`}
                                >
                                  {displayMarkers.map((marker, idx) => (
                                    <span
                                      key={idx}
                                      className={`inline-block w-5 h-5 rounded-full text-white text-xs font-bold flex items-center justify-center mx-0.5 my-0.5 cursor-pointer transition-all duration-200 transform hover:scale-125
                                        ${marker.type === 'S' ? 'bg-blue-500' : ''}
                                        ${marker.type === 'P' ? 'bg-green-500' : ''}
                                        ${marker.type.startsWith('R') ? 'bg-red-500' : ''}
                                      `}
                                      title={`Date de ${getMarkerTitle(marker.type)}: ${marker.date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}`}
                                      onClick={() => handleCalendarMarkerClick(crop.id, marker.type)}
                                    >
                                      {marker.label}
                                    </span>
                                  ))}
                                  {/* Bouton d'ajout rapide pour les cellules vides */}
                                  {displayMarkers.length === 0 && (
                                    <button
                                      onClick={() => handleAddCropFromCalendarClick(monthIndex, weekIndex)}
                                      className="absolute inset-0 flex items-center justify-center bg-green-500 bg-opacity-0 hover:bg-opacity-75 text-white rounded-lg transition-opacity duration-200 opacity-0 group-hover:opacity-100"
                                      title="Ajouter une culture ici"
                                    >
                                      <Plus className="w-5 h-5" />
                                    </button>
                                  )}
                                </td>
                              );
                            })}
                          </React.Fragment>
                        ))}
                      </tr>
                    ))
                  )}
                  {/* Nouvelle ligne pour ajouter une culture */}
                  <tr className="border-t-2 border-green-300 bg-green-50">
                      <td className="sticky left-0 bg-green-50 py-3 px-4 text-left text-sm font-medium text-green-700 z-10 whitespace-nowrap">
                          <Plus className="w-4 h-4 inline-block mr-1 text-green-600"/> Nouvelle culture
                      </td>
                      {months.flatMap((_, monthIndex) => (
                          Array.from({ length: weeksPerMonth }).map((_, weekIndex) => (
                              <td
                                  key={`add-new-${monthIndex}-${weekIndex}`}
                                  className="py-2 px-2 text-center text-xs border-l border-gray-100 hover:bg-green-200 cursor-pointer transition-colors duration-150"
                                  onClick={() => handleAddCropFromCalendarClick(monthIndex, weekIndex)}
                                  title={`Ajouter une culture en ${monthsFull[monthIndex]} S${weekIndex + 1}`}
                              >
                                  <Plus className="w-4 h-4 text-green-500 mx-auto" />
                              </td>
                          ))
                      ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-8 p-4 bg-gray-50 rounded-lg shadow-sm">
                <h4 className="text-lg font-semibold text-gray-700 mb-2">Légende du Calendrier :</h4>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                        <span className="inline-block w-5 h-5 rounded-full bg-blue-500 mr-2"></span> S: Semis
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-5 h-5 rounded-full bg-green-500 mr-2"></span> P: Plantation
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-5 h-5 rounded-full bg-red-500 mr-2"></span> R: Récolte
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-5 h-5 bg-green-200 border border-gray-300 mr-2"></span> Période Semis/Plantation
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-5 h-5 bg-yellow-200 border border-gray-300 mr-2"></span> Période de Croissance (entre Plantation et Récolte)
                    </div>
                    <div className="flex items-center">
                        <span className="inline-block w-5 h-5 bg-red-200 border border-gray-300 mr-2"></span> Période de Récolte
                    </div>
                </div>
            </div>
          </section>
        )}

        {activeSection === 'vegetable_database' && (
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
              <Database className="h-8 w-8 text-green-600 mr-3" />
              Base de Données des Légumes
            </h2>

            {/* Section de Filtrage */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <label htmlFor="vegFilterType" className="block text-gray-700 text-sm font-bold">Filtrer par :</label>
                <select
                    id="vegFilterType"
                    value={vegFilterType}
                    onChange={(e) => {
                        setVegFilterType(e.target.value);
                        setVegFilterValue(''); // Reset filter value when type changes
                    }}
                    className="shadow-sm border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                >
                    <option value="name">Nom</option>
                    <option value="variety">Variété</option>
                    <option value="family">Famille</option>
                </select>
                <input
                    type="text"
                    value={vegFilterValue}
                    onChange={(e) => setVegFilterValue(e.target.value)}
                    placeholder={`Rechercher par ${vegFilterType === 'name' ? 'nom' : vegFilterType === 'variety' ? 'variété' : 'famille'}...`}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                />
            </div>

            {/* Section des Boutons d'Action (déplacée en dessous du filtre) */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <button
                    onClick={handleBulkDeleteVegetables}
                    disabled={selectedVegetables.length === 0}
                    className={`bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center ${selectedVegetables.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    <Trash2 className="w-5 h-5 mr-2" /> Supprimer ({selectedVegetables.length})
                </button>
                <button
                    onClick={handleExportVegetablesCSV}
                    className="bg-green-700 hover:bg-green-800 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
                >
                    <Save className="w-5 h-5 mr-2" /> Export CSV
                </button>
                <button
                    onClick={handleImportVegetablesCSVClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
                >
                    <Upload className="w-5 h-5 mr-2" /> Import CSV
                </button>
            </div>


            {sortedFilteredVegetables.length === 0 ? (
              <p className="text-gray-500 text-center italic">Aucun légume enregistré ne correspond à votre filtre.</p>
            ) : (
              <div className="overflow-x-auto mb-8 rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-green-100 border-b border-green-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                          <input
                              type="checkbox"
                              onChange={handleSelectAllVegetables}
                              checked={selectedVegetables.length === filteredVegetables.length && filteredVegetables.length > 0}
                              className="form-checkbox h-4 w-4 text-green-600 rounded"
                          />
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handleVegSort('name')}>
                          Nom {vegSortColumn === 'name' && (vegSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handleVegSort('variety')}>
                          Variété {vegSortColumn === 'variety' && (vegSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handleVegSort('family')}>
                          Famille {vegSortColumn === 'family' && (vegSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handleVegSort('sowingPeriod')}>
                          Période Semis {vegSortColumn === 'sowingPeriod' && (vegSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handleVegSort('plantingPeriod')}>
                          Période Plantation {vegSortColumn === 'plantingPeriod' && (vegSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handleVegSort('cultureDuration')}>
                          Durée Culture {vegSortColumn === 'cultureDuration' && (vegSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handleVegSort('plantSpacing')}>
                          Distance Plants (m) {vegSortColumn === 'plantSpacing' && (vegSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handleVegSort('rowSpacing')}>
                          Distance Lignes (m) {vegSortColumn === 'rowSpacing' && (vegSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handleVegSort('unitCost')}>
                          Coût unitaire (€) {vegSortColumn === 'unitCost' && (vegSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handleVegSort('costingUnit')}>
                          Unité de coût {vegSortColumn === 'costingUnit' && (vegSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedFilteredVegetables.map((veg) => (
                      <tr key={veg.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 whitespace-nowrap">
                            <input
                                type="checkbox"
                                checked={selectedVegetables.includes(veg.id)}
                                onChange={() => handleSelectVegetable(veg.id)}
                                className="form-checkbox h-4 w-4 text-green-600 rounded"
                            />
                        </td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{veg.name}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{veg.variety || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{veg.family}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{veg.sowingPeriod}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{veg.plantingPeriod}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{veg.cultureDuration || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{veg.plantSpacing || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{veg.rowSpacing || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{veg.unitCost ? `${veg.unitCost} €` : 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{veg.costingUnit || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditVegetableClick(veg)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-200"
                              title="Modifier"
                            >
                              <PencilLine className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteVegetableClick(veg)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition duration-200"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Formulaire d'ajout/modification de légume */}
            <div className="bg-green-50 p-6 rounded-xl shadow-lg border border-green-200">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">{editingVegId ? 'Modifier un Légume' : 'Ajouter un Nouveau Légume'}</h3>
              <form onSubmit={handleAddOrUpdateVegetable} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="vegFormName" className="block text-gray-700 text-sm font-bold mb-2">
                    Nom: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vegFormName"
                    value={vegFormName}
                    onChange={(e) => setVegFormName(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: Tomate"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="vegFormVariety" className="block text-gray-700 text-sm font-bold mb-2">
                    Variété:
                  </label>
                  <input
                    type="text"
                    id="vegFormVariety"
                    value={vegFormVariety}
                    onChange={(e) => setVegFormVariety(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: Marmande"
                  />
                </div>
                <div>
                  <label htmlFor="vegFormFamily" className="block text-gray-700 text-sm font-bold mb-2">
                    Famille: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="vegFormFamily"
                    value={vegFormFamily}
                    onChange={(e) => setVegFormFamily(e.target.value)}
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    required
                  >
                    <option value="">Sélectionnez une famille</option>
                    {uniqueVegetableFamilies.map(family => (
                        <option key={family} value={family}>{family}</option>
                    ))}
                    {/* Option pour ajouter une famille personnalisée si nécessaire */}
                  </select>
                </div>
                <div>
                  <label htmlFor="vegFormSowingPeriod" className="block text-gray-700 text-sm font-bold mb-2">
                    Période de semis: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vegFormSowingPeriod"
                    value={vegFormSowingPeriod}
                    onChange={(e) => setVegFormSowingPeriod(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: Fév-Avr"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="vegFormPlantingPeriod" className="block text-gray-700 text-sm font-bold mb-2">
                    Période de plantation: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vegFormPlantingPeriod"
                    value={vegFormPlantingPeriod}
                    onChange={(e) => setVegFormPlantingPeriod(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: Avr-Juin"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="vegFormCultureDuration" className="block text-gray-700 text-sm font-bold mb-2">
                    Durée de culture avant récolte (jours/mois): <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="vegFormCultureDuration"
                    value={vegFormCultureDuration}
                    onChange={(e) => setVegFormCultureDuration(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: 60-90 jours ou 2-3 mois"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="vegFormPlantSpacing" className="block text-gray-700 text-sm font-bold mb-2">
                    Distance Plants (m):
                  </label>
                  <input
                    type="number"
                    id="vegFormPlantSpacing"
                    value={vegFormPlantSpacing}
                    onChange={(e) => setVegFormPlantSpacing(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: 0.3 (30cm)"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="vegFormRowSpacing" className="block text-gray-700 text-sm font-bold mb-2">
                    Distance Lignes (m):
                  </label>
                  <input
                    type="number"
                    id="vegFormRowSpacing"
                    value={vegFormRowSpacing}
                    onChange={(e) => setVegFormRowSpacing(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: 0.5 (50cm)"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="vegFormUnitCost" className="block text-gray-700 text-sm font-bold mb-2">
                    Coût unitaire (€):
                  </label>
                  <input
                    type="number"
                    id="vegFormUnitCost"
                    value={vegFormUnitCost}
                    onChange={(e) => setVegFormUnitCost(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: 0.15"
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="vegFormCostingUnit" className="block text-gray-700 text-sm font-bold mb-2">
                    Unité de coût:
                  </label>
                  <select
                    id="vegFormCostingUnit"
                    value={vegFormCostingUnit}
                    onChange={(e) => setVegFormCostingUnit(e.target.value)}
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                  >
                    <option value="plant">plant</option>
                    <option value="graine">graine</option>
                    <option value="sachet">sachet</option>
                  </select>
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
                  >
                    {editingVegId ? <PencilLine className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                    {editingVegId ? 'Modifier le Légume' : 'Ajouter le Légume'}
                  </button>
                  {editingVegId && (
                    <button
                      type="button"
                      onClick={handleCancelVegetableEdit}
                      className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
                    >
                      <X className="w-5 h-5 mr-2" /> Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}


        {activeSection === 'rotation' && (
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
              <RotateCcw className="h-8 w-8 text-green-600 mr-3" />
              Gestion des Parcelles
            </h2>

            {/* Section de Filtrage des Parcelles */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow-sm flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <label htmlFor="plotFilterType" className="block text-gray-700 text-sm font-bold text-sm">Filtrer par :</label>
                <select
                    id="plotFilterType"
                    value={plotFilterType}
                    onChange={(e) => {
                        setPlotFilterType(e.target.value);
                        setPlotFilterValue(''); // Reset filter value when type changes
                    }}
                    className="shadow-sm border border-gray-300 rounded-lg py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                >
                    <option value="name">Nom de parcelle</option>
                    <option value="family">Famille assignée</option>
                </select>
                <input
                    type="text"
                    value={plotFilterValue}
                    onChange={(e) => setPlotFilterValue(e.target.value)}
                    placeholder={`Rechercher par ${plotFilterType === 'name' ? 'nom' : 'famille'}...`}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full sm:w-auto flex-1 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                />
            </div>

            {sortedFilteredPlots.length === 0 ? (
              <p className="text-gray-500 text-center italic">Aucune parcelle enregistrée. Utilisez le formulaire ci-dessous pour en ajouter une nouvelle.</p>
            ) : (
              <div className="overflow-x-auto mb-8 rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-green-100 border-b border-green-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handlePlotSort('name')}>
                          Nom {plotSortColumn === 'name' && (plotSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handlePlotSort('assignedFamily')}>
                          Famille Assignée {plotSortColumn === 'assignedFamily' && (plotSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handlePlotSort('bedSize')}>
                          Taille des Planches {plotSortColumn === 'bedSize' && (plotSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handlePlotSort('numberOfBeds')}>
                          Nombre de Planches {plotSortColumn === 'numberOfBeds' && (plotSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider cursor-pointer hover:text-green-900" onClick={() => handlePlotSort('area')}>
                          Superficie (m²) {plotSortColumn === 'area' && (plotSortDirection === 'asc' ? <ArrowUp className="inline-block w-4 h-4 ml-1" /> : <ArrowDown className="inline-block w-4 h-4 ml-1" />)}
                      </th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Notes</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedFilteredPlots.map((plot) => (
                      <tr key={plot.id} className="hover:bg-gray-50">
                        <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{plot.name}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{plot.assignedFamily}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{plot.bedSize || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{plot.numberOfBeds || '0'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{plot.area ? `${plot.area} m²` : '0 m²'}</td>
                        <td className="py-3 px-4 text-sm text-gray-700">{plot.notes || 'N/A'}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditPlotClick(plot)}
                              className="text-blue-600 hover:text-blue-900 p-1 rounded-full hover:bg-blue-100 transition duration-200"
                              title="Modifier"
                            >
                              <PencilLine className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDuplicatePlotClick(plot)} // New Duplicate button for plots
                              className="text-yellow-600 hover:text-yellow-900 p-1 rounded-full hover:bg-yellow-100 transition duration-200"
                              title="Dupliquer"
                            >
                              <Copy className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeletePlotClick(plot)}
                              className="text-red-600 hover:text-red-900 p-1 rounded-full hover:bg-red-100 transition duration-200"
                              title="Supprimer"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Formulaire d'ajout/modification de parcelle */}
            <div className="bg-green-50 p-6 rounded-xl shadow-lg border border-green-200 mt-8">
              <h3 className="text-2xl font-semibold text-green-700 mb-4">{editingPlotId ? 'Modifier une Parcelle' : 'Ajouter une Nouvelle Parcelle'}</h3>
              <form onSubmit={handleAddOrUpdatePlot} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="plotFormName" className="block text-gray-700 text-sm font-bold mb-2">
                    Nom de la parcelle: <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="plotFormName"
                    value={plotFormName}
                    onChange={(e) => setPlotFormName(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: Parcelle 1"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="plotFormFamily" className="block text-gray-700 text-sm font-bold mb-2">
                    Famille de légumes associée: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="plotFormFamily"
                    value={plotFormFamily}
                    onChange={handlePlotFamilyChange}
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    required
                    disabled={isPlotFamilyChangeDisabled}
                  >
                    <option value="">Sélectionnez une famille</option>
                    {uniqueVegetableFamilies.map(family => (
                      <option key={family} value={family}>{family}</option>
                    ))}
                    <option value="autre">Autre (saisir une famille personnalisée)</option>
                  </select>
                  {isPlotFamilyChangeDisabled && (
                      <p className="text-red-500 text-xs mt-1">La famille ne peut pas être modifiée car des cultures sont associées à cette parcelle.</p>
                  )}
                </div>
                {isCustomFamilyInputVisible && (
                    <div className="md:col-span-2">
                        <label htmlFor="customFamilyName" className="block text-gray-700 text-sm font-bold mb-2">
                            Nom de la famille personnalisée: <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="customFamilyName"
                            value={customFamilyName}
                            onChange={(e) => setCustomFamilyName(e.target.value)}
                            className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                            placeholder="Ex: Solanacées"
                            required
                        />
                    </div>
                )}
                <div>
                  <label htmlFor="plotFormBedSize" className="block text-gray-700 text-sm font-bold mb-2">
                    Taille des planches (Lxl en m, ex: 10x1.2):
                  </label>
                  <input
                    type="text"
                    id="plotFormBedSize"
                    value={plotFormBedSize}
                    onChange={(e) => setPlotFormBedSize(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: 10x1.2"
                  />
                </div>
                <div>
                  <label htmlFor="plotFormNumberOfBeds" className="block text-gray-700 text-sm font-bold mb-2">
                    Nombre de planches:
                  </label>
                  <input
                    type="number"
                    id="plotFormNumberOfBeds"
                    value={plotFormNumberOfBeds}
                    onChange={(e) => setPlotFormNumberOfBeds(e.target.value)}
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ex: 5"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="plotFormArea" className="block text-gray-700 text-sm font-bold mb-2">
                    Superficie calculée (m²):
                  </label>
                  <input
                    type="text"
                    id="plotFormArea"
                    value={plotFormArea}
                    readOnly
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 bg-gray-100 cursor-not-allowed"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="plotFormNotes" className="block text-gray-700 text-sm font-bold mb-2">
                    Notes:
                  </label>
                  <textarea
                    id="plotFormNotes"
                    value={plotFormNotes}
                    onChange={(e) => setPlotFormNotes(e.target.value)}
                    rows="3"
                    className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    placeholder="Ajoutez des notes sur cette parcelle..."
                  ></textarea>
                </div>
                <div className="md:col-span-2 flex justify-end space-x-3 mt-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
                  >
                    {editingPlotId ? <PencilLine className="w-5 h-5 mr-2" /> : <Plus className="w-5 h-5 mr-2" />}
                    {editingPlotId ? 'Modifier la Parcelle' : 'Ajouter la Parcelle'}
                  </button>
                  {editingPlotId && (
                    <button
                      type="button"
                      onClick={handleCancelPlotEdit}
                      className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md flex items-center"
                    >
                      <X className="w-5 h-5 mr-2" /> Annuler
                    </button>
                  )}
                </div>
              </form>
            </div>
          </section>
        )}

        {activeSection === 'chiffrage_cultures' && (
          <section>
            <h2 className="text-3xl font-semibold text-gray-800 mb-6 flex items-center justify-center">
              <Euro className="h-8 w-8 text-green-600 mr-3" />
              Chiffrage des Cultures
            </h2>

            {aggregatedCostingData.length === 0 ? (
              <p className="text-gray-500 text-center italic">Aucune donnée de culture pour le chiffrage. Veuillez ajouter des cultures dans l'onglet "Cultures" et renseigner les coûts unitaires dans la "Base de données des légumes".</p>
            ) : (
              <div className="overflow-x-auto mb-8 rounded-lg shadow-md border border-gray-200">
                <table className="min-w-full bg-white">
                  <thead className="bg-green-100 border-b border-green-200">
                    <tr>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Légume</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Variété</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Superficie Totale (m²)</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Plants Totaux Est.</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Coût unitaire (€)</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Unité de coût</th>
                      <th className="py-3 px-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Coût Total Est. (€)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {aggregatedCostingData.map((data, index) => (
                      <tr key={`${data.name}-${data.variety}-${index}`} className="hover:bg-gray-50">
                        <td className="py-3 px-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.name}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{data.variety}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{data.totalArea.toFixed(2)}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{data.totalPlants}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{data.unitCost.toFixed(2)}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm text-gray-700">{data.costingUnit}</td>
                        <td className="py-3 px-4 whitespace-nowrap text-sm font-bold text-gray-900">{data.totalCalculatedCost} €</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-green-100 border-t-2 border-green-300">
                    <tr>
                      <th colSpan="6" className="py-3 px-4 text-right text-sm font-bold text-gray-800 uppercase">Total Général des Coûts:</th>
                      <th className="py-3 px-4 text-left text-sm font-bold text-gray-800">
                        {aggregatedCostingData.reduce((sum, item) => sum + parseFloat(item.totalCalculatedCost), 0).toFixed(2)} €
                      </th>
                    </tr>
                  </tfoot>
                </table>
              </div>
            )}
          </section>
        )}


        {/* Modal de Confirmation Générique */}
        {showConfirmModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmer la suppression</h3>
              {itemToDelete.type === 'crop' && (
                <p className="text-gray-700 mb-6">Êtes-vous sûr de vouloir supprimer la culture <span className="font-semibold">"{itemToDelete.name}"</span> ?</p>
              )}
              {itemToDelete.type === 'harvest' && (
                <p className="text-gray-700 mb-6">Êtes-vous sûr de vouloir supprimer la récolte de <span className="font-semibold">"{itemToDelete.name}"</span> du <span className="font-semibold">{itemToDelete.date}</span> ?</p>
              )}
              {itemToDelete.type === 'vegetable' && (
                <p className="text-gray-700 mb-6">Êtes-vous sûr de vouloir supprimer le légume <span className="font-semibold">"{itemToDelete.name}"</span> de la base de données ?</p>
              )}
              {itemToDelete.type === 'plot' && (
                <p className="text-gray-700 mb-6">Êtes-vous sûr de vouloir supprimer la parcelle <span className="font-semibold">"{itemToDelete.name}"</span> ?</p>
              )}
              {itemToDelete.type === 'vegetable-bulk' && (
                <p className="text-gray-700 mb-6">Êtes-vous sûr de vouloir supprimer <span className="font-semibold">{itemToDelete.count}</span> légumes sélectionnés de la base de données ?</p>
              )}

              <div className="flex justify-center space-x-4">
                <button
                  onClick={confirmDeleteAction}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  Supprimer
                </button>
                <button
                  onClick={cancelDelete}
                  className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal de Duplication de Culture */}
        {showDuplicateCropModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Dupliquer la Culture</h3>
                    <p className="text-gray-700 mb-4">
                        Combien de copies de "<span className="font-semibold">{cropToDuplicate?.name}</span>" souhaitez-vous créer ?
                    </p>
                    <input
                        type="number"
                        min="1"
                        value={numberOfCropCopies}
                        onChange={(e) => setNumberOfCropCopies(parseInt(e.target.value) || 1)}
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 mb-6"
                    />
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={confirmDuplicateCropAction}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Dupliquer
                        </button>
                        <button
                            onClick={resetDuplicateCropModal}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Modal de Duplication de Parcelle */}
        {showDuplicatePlotModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Dupliquer la Parcelle</h3>
                    <p className="text-gray-700 mb-4">
                        Combien de copies de "<span className="font-semibold">{plotToDuplicate?.name}</span>" souhaitez-vous créer ?
                    </p>
                    <input
                        type="number"
                        min="1"
                        value={numberOfPlotCopies}
                        onChange={(e) => setNumberOfPlotCopies(parseInt(e.target.value) || 1)}
                        className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200 mb-6"
                    />
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={confirmDuplicatePlotAction}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Dupliquer
                        </button>
                        <button
                            onClick={resetDuplicatePlotModal}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Modal de Message Personnalisé */}
        {showMessageModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className={`rounded-lg p-6 shadow-xl max-w-sm w-full text-center
              ${messageModalContent.type === 'success' ? 'bg-green-100 border border-green-400' : ''}
              ${messageModalContent.type === 'error' ? 'bg-red-100 border border-red-400' : ''}
              ${messageModalContent.type === 'info' ? 'bg-blue-100 border border-blue-400' : ''}
            `}>
              <h3 className={`text-xl font-bold mb-4
                ${messageModalContent.type === 'success' ? 'text-green-800' : ''}
                ${messageModalContent.type === 'error' ? 'text-red-800' : ''}
                ${messageModalContent.type === 'info' ? 'text-blue-800' : ''}
              `}>
                {messageModalContent.type === 'success' && <CheckCircle className="inline-block w-6 h-6 mr-2 text-green-600" />}
                {messageModalContent.type === 'error' && <AlertTriangle className="inline-block w-6 h-6 mr-2 text-red-600" />}
                {messageModalContent.type === 'info' && <Info className="inline-block w-6 h-6 mr-2 text-blue-600" />}
                {messageModalContent.title}
              </h3>
              <p className="text-gray-700 mb-6 whitespace-pre-line">{messageModalContent.body}</p>
              <button
                onClick={closeMessageModal}
                className={`font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md
                  ${messageModalContent.type === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                  ${messageModalContent.type === 'error' ? 'bg-red-600 hover:bg-red-700 text-white' : ''}
                  ${messageModalContent.type === 'info' ? 'bg-blue-600 hover:bg-blue-700 text-white' : ''}
                `}
              >
                OK
              </button>
            </div>
          </div>
        )}

        {/* Modal de confirmation d'importation JSON (toutes données) */}
        {showImportAllConfirmModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 shadow-xl max-w-sm w-full text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmer l'importation JSON</h3>
                    <p className="text-gray-700 mb-6">
                        Êtes-vous sûr de vouloir importer les données du fichier <span className="font-semibold">"{fileToImportAll?.name}"</span> ?
                        Cela <span className="font-bold text-red-600">remplacera toutes les données actuelles</span> (cultures, récoltes, légumes, parcelles) par celles du fichier.
                    </p>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={confirmImportAllDataJSONAction}
                            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Confirmer et Remplacer
                        </button>
                        <button
                            onClick={cancelImportAll}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Modal de confirmation d'importation CSV (légumes uniquement) */}
        {showImportVegCSVConfirmModal && (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-4">Confirmer l'importation CSV des Légumes</h3>
                    <p className="text-gray-700 mb-4">
                        Vous êtes sur le point d'importer les données de légumes depuis le fichier <span className="font-semibold">"{fileToImportVegCSV?.name}"</span>.
                    </p>
                    <p className="text-gray-700 mb-6">
                        Choisissez le mode d'importation :
                    </p>
                    <div className="flex justify-center space-x-6 mb-6">
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="merge"
                                checked={csvImportMode === 'merge'}
                                onChange={() => setCsvImportMode('merge')}
                                className="form-radio h-4 w-4 text-green-600"
                            />
                            <span className="ml-2 text-gray-700 font-medium">Fusionner (Ajouter/Mettre à jour)</span>
                        </label>
                        <label className="flex items-center">
                            <input
                                type="radio"
                                value="replace"
                                checked={csvImportMode === 'replace'}
                                onChange={() => setCsvImportMode('replace')}
                                className="form-radio h-4 w-4 text-red-600"
                            />
                            <span className="ml-2 text-gray-700 font-medium">Remplacer (Supprimer tout et importer)</span>
                        </label>
                    </div>
                    <div className="flex justify-center space-x-4">
                        <button
                            onClick={confirmImportVegetablesCSVAction}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Confirmer l'Importation
                        </button>
                        <button
                            onClick={cancelImportVegCSV}
                            className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                        >
                            Annuler
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Modal d'ajout de culture depuis le calendrier */}
        {showAddFromCalendarModal && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Ajouter une Culture depuis le Calendrier</h3>
              <p className="text-gray-700 mb-4">
                Ajouter une culture pour la semaine {calendarModalWeekIndex + 1} de {monthsFull[calendarModalMonthIndex]}.
              </p>
              <form onSubmit={handleConfirmAddCropFromCalendar}>
                <div className="mb-4">
                  <label htmlFor="calendarModalSelectedPlotId" className="block text-gray-700 text-sm font-bold mb-2">
                    Sélectionnez une parcelle: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="calendarModalSelectedPlotId"
                    value={calendarModalSelectedPlotId}
                    onChange={handleCalendarModalPlotChange}
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    required
                  >
                    <option value="">Sélectionnez une parcelle</option>
                    {plots.map(plot => (
                      <option key={plot.id} value={plot.id}>
                        {plot.name} ({plot.assignedFamily})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-6">
                  <label htmlFor="calendarModalSelectedVegId" className="block text-gray-700 text-sm font-bold mb-2">
                    Sélectionnez un légume: <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="calendarModalSelectedVegId"
                    value={calendarModalSelectedVegId}
                    onChange={handleCalendarModalVegChange}
                    className="shadow-sm border border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-200"
                    required
                    disabled={!calendarModalSelectedPlotId}
                  >
                    <option value="">Sélectionnez un légume</option>
                    {getFilteredVegetablesForCalendarModal().map(veg => (
                      <option key={veg.id} value={veg.id}>
                        {veg.name} {veg.variety && `(${veg.variety})`}
                      </option>
                    ))}
                  </select>
                  {!calendarModalSelectedPlotId && (
                    <p className="text-sm text-gray-500 mt-1">Veuillez d'abord sélectionner une parcelle.</p>
                  )}
                  {calendarModalSelectedPlotId && getFilteredVegetablesForCalendarModal().length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">Aucun légume correspondant à la famille de la parcelle et à la période de semis/plantation pour ce mois.</p>
                  )}
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="submit"
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                  >
                    Ajouter la Culture
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelAddCropFromCalendar}
                    className="bg-gray-400 hover:bg-gray-500 text-white font-bold py-2 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md"
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default App;
