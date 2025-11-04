// Variables globales
const darkModeKey = 'cv-dark-mode';

// Fonction pour l'animation du texte de bienvenue dans le terminal
function initTerminalAnimation() {
    const terminal = document.querySelector('.terminal');
    const command = terminal.querySelector('.command');
    const cursor = terminal.querySelector('.cursor');
    const prefix = 'echo "';
    const text = "Bienvenue sur mon CV";
    const suffix = '"';
    let fullText = prefix + text + suffix;
    let index = 0;

    // Vider le contenu existant
    command.textContent = '';

    function typeText() {
        if (index < fullText.length) {
            command.textContent += fullText.charAt(index);
            index++;
            setTimeout(typeText, 100);
        }
    }

    // Animer le curseur
    setInterval(() => {
        cursor.style.opacity = cursor.style.opacity === '0' ? '1' : '0';
    }, 500);

    // Démarrer l'animation d'écriture
    setTimeout(typeText, 1000);
}

// Animation des barres de progression des compétences
function initProgressBars() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target.querySelector('.progress');
                const targetWidth = progressBar.textContent;
                progressBar.style.width = targetWidth;
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.skill').forEach(skill => observer.observe(skill));
}

// Scroll fluide pour la navigation
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Fermer le menu mobile si ouvert
                const navbarToggler = document.querySelector('.navbar-toggler');
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse.classList.contains('show')) {
                    navbarToggler.click();
                }
            }
        });
    });
}

// Gestion du mode sombre/clair
function initDarkMode() {
    // Créer le bouton de thème
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = `
        <button id="theme-toggle" class="theme-toggle-btn" title="Changer le thème">
            <i id="theme-icon" class="fas fa-sun"></i>
        </button>
    `;

    // Insérer le bouton dans la navbar
    const navbar = document.querySelector('.navbar .navbar-collapse');
    navbar.appendChild(themeToggle);

    // Fonction pour changer le thème
    function toggleTheme() {
        const isDarkMode = document.body.classList.toggle('dark-mode');
        const root = document.documentElement;
        const themeIcon = document.getElementById('theme-icon');

        if (isDarkMode) {
            // Thème sombre
            root.style.setProperty('--primary', '#1a1a2e');         // Bleu nuit profond
            root.style.setProperty('--primary-light', '#16213e');   // Bleu nuit plus clair
            root.style.setProperty('--primary-dark', '#0f3460');    // Bleu profond
            root.style.setProperty('--accent', '#9aabe2ff');          // Rouge vif
            root.style.setProperty('--accent-light', '#6a73c7ff');    // Rose vif
            root.style.setProperty('--bg-light', '#0f0f0f');       // Fond très sombre
            root.style.setProperty('--text-light', '#e8e9f1ff');      // Texte blanc
            root.style.setProperty('--text-dark', '#e0e0e0ff');      // Texte gris clair
            root.style.setProperty('--card-bg', '#16213e');        // Fond des cartes
            themeIcon.className = 'fas fa-sun';
            themeToggle.title = 'Passer en mode clair';
        } else {
            // Thème clair
            root.style.setProperty('--primary', '#79b0f0ff');         // Bleu ciel
            root.style.setProperty('--primary-light', '#5ca1ef');   // Bleu ciel plus clair
            root.style.setProperty('--primary-dark', '#d2dce6ff');    // Bleu ciel plus foncé
            root.style.setProperty('--accent', '#6b75ffff');          // Corail
            root.style.setProperty('--accent-light', '#9987ffff');    // Corail clair
            root.style.setProperty('--bg-light', '#e4e8ecff');       // Fond très clair
            root.style.setProperty('--text-light', '#090b0cff');     // Texte presque noir
            root.style.setProperty('--text-dark', '#4d4d4d');      // Texte gris foncé
            root.style.setProperty('--card-bg', '#ffffff');        // Fond des cartes blanc
            themeIcon.className = 'fas fa-moon';
            themeToggle.title = 'Passer en mode sombre';
        }

        localStorage.setItem(darkModeKey, isDarkMode);
    }

    // Vérifier le mode précédent
    const isDarkMode = localStorage.getItem(darkModeKey) === 'true';
    if (isDarkMode) {
        toggleTheme();
    }

    // Ajouter l'écouteur d'événement
    document.getElementById('theme-toggle').addEventListener('click', toggleTheme);
}

// Animation des icônes de contact
function initContactAnimation() {
    const contactIcons = document.querySelectorAll('.contact-icons a');
    
    contactIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1) rotate(5deg)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1) rotate(0deg)';
        });
    });
}

// Filtrage des compétences
function initSkillsFilter() {
    const skillsContainer = document.querySelector('.skills');
    if (!skillsContainer) return;

    const filterContainer = document.createElement('div');
    filterContainer.className = 'skills-filter';
    filterContainer.innerHTML = `
        <button class="filter-btn active" data-filter="all">Tout</button>
        <button class="filter-btn" data-filter="langage">Langages</button>
        <button class="filter-btn" data-filter="outil">Outils</button>
        <button class="filter-btn" data-filter="soft">Soft Skills</button>
    `;

    skillsContainer.insertBefore(filterContainer, skillsContainer.firstChild);

    filterContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('filter-btn')) {
            const filter = e.target.dataset.filter;
            
            // Mettre à jour les boutons actifs
            filterContainer.querySelectorAll('.filter-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            e.target.classList.add('active');
            
            // Filtrer les compétences
            document.querySelectorAll('.skill').forEach(skill => {
                if (filter === 'all' || skill.dataset.category === filter) {
                    skill.style.display = '';
                } else {
                    skill.style.display = 'none';
                }
            });
        }
    });
}

// Téléchargement du CV avec animation
function initDownloadButton() {
    const downloadBtn = document.querySelector('.btn-download');
    if (!downloadBtn) return;

    // Créer le toast de notification
    const toast = document.createElement('div');
    toast.className = 'download-toast';
    toast.style.opacity = '0';
    document.body.appendChild(toast);

    downloadBtn.innerHTML = '<span class="icon">📄</span> Télécharger mon CV';

    downloadBtn.addEventListener('click', function(e) {
        // Ajouter l'animation de téléchargement
        this.classList.add('downloading');
        this.innerHTML = '<span class="icon">⏬</span> Téléchargement...';

        // Simuler le temps de téléchargement
        setTimeout(() => {
            // Réinitialiser le bouton
            this.classList.remove('downloading');
            this.innerHTML = '<span class="icon">📄</span> Télécharger mon CV';

            // Afficher le toast de confirmation
            toast.textContent = '✅ CV téléchargé avec succès !';
            toast.classList.add('show');
            toast.style.opacity = '1';

            // Cacher le toast après 3 secondes
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => toast.classList.remove('show'), 300);
            }, 3000);
        }, 2000);
    });
}

// Initialisation au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    initTerminalAnimation();
    initProgressBars();
    initSmoothScroll();
    initDarkMode();
    initContactAnimation();
    initSkillsFilter();
    initDownloadButton();
});