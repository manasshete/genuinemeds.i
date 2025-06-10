// Global JavaScript functionality for GenuineMeds.in

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeAnimations()
  initializeScrollEffects()
  initializePage()
})

// Initialize page-specific functionality
function initializePage() {
  const currentPage = window.location.pathname.split("/").pop() || "index.html"

  switch (currentPage) {
    case "drugs.html":
      initializeDrugsPage()
      break
    case "contact.html":
      initializeContactForm()
      break
    default:
      // Home page or other pages
      break
  }
}

// Navigation functionality
function initializeNavigation() {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      navToggle.classList.toggle("active")
    })

    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll(".nav-link")
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")
      })
    })

    // Close mobile menu when clicking outside
    document.addEventListener("click", (e) => {
      if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
        navMenu.classList.remove("active")
        navToggle.classList.remove("active")
      }
    })
  }
}

// Animation functionality
function initializeAnimations() {
  // Intersection Observer for fade-in animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
        observer.unobserve(entry.target)
      }
    })
  }, observerOptions)

  // Observe elements with fade-in class
  const fadeElements = document.querySelectorAll(".fade-in")
  fadeElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateY(20px)"
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer.observe(el)
  })

  // Observe elements with slide-in classes
  const slideLeftElements = document.querySelectorAll(".slide-in-left")
  slideLeftElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateX(-30px)"
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer.observe(el)
  })

  const slideRightElements = document.querySelectorAll(".slide-in-right")
  slideRightElements.forEach((el) => {
    el.style.opacity = "0"
    el.style.transform = "translateX(30px)"
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out"
    observer.observe(el)
  })
}

// Scroll effects
function initializeScrollEffects() {
  const navbar = document.querySelector(".navbar")

  if (navbar) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)"
        navbar.style.boxShadow = "0 4px 6px -1px rgb(0 0 0 / 0.1)"
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)"
        navbar.style.boxShadow = "none"
      }
    })
  }

  // Smooth scrolling for anchor links
  const anchorLinks = document.querySelectorAll('a[href^="#"]')
  anchorLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const targetId = this.getAttribute("href")
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })
}

// Drugs page functionality
function initializeDrugsPage() {
  if (typeof window.drugsData !== "undefined") {
    displayDrugs(window.drugsData)
    setupSearch()
    setupFilters()
  }
}

// Display drugs in grid
function displayDrugs(drugsToShow) {
  const grid = document.getElementById("drugsGrid")
  const noResults = document.getElementById("noResults")

  if (!grid) return

  if (drugsToShow.length === 0) {
    grid.innerHTML = ""
    if (noResults) noResults.style.display = "block"
    return
  }

  if (noResults) noResults.style.display = "none"

  grid.innerHTML = drugsToShow
    .map(
      (drug) => `
        <a href="${drug.name.toLowerCase().replace(/\s+/g, "-")}.html" class="drug-card fade-in">
            <div class="drug-image">
                ${getDrugIcon(drug.category)}
            </div>
            <div class="drug-info">
                <h3 class="drug-name">${drug.name}</h3>
                <div class="drug-category">${formatCategory(drug.category)}</div>
                <p class="drug-description">${drug.description}</p>
                <div class="drug-meta">
                    <span>Dosage: ${drug.dosage}</span>
                    <span>${drug.uses.length} uses</span>
                </div>
            </div>
        </a>
    `,
    )
    .join("")

  // Re-initialize animations for new elements
  initializeAnimations()
}

// Get appropriate icon for drug category
function getDrugIcon(category) {
  const icons = {
    "pain-relief": `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="10" y="30" width="60" height="20" rx="10" fill="#3b82f6" opacity="0.8"/>
            <rect x="30" y="10" width="20" height="60" rx="10" fill="#3b82f6" opacity="0.6"/>
        </svg>`,
    antibiotics: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="40" cy="40" r="25" fill="#10b981" opacity="0.8"/>
            <circle cx="40" cy="40" r="15" fill="white"/>
            <circle cx="40" cy="40" r="8" fill="#10b981"/>
        </svg>`,
    cardiovascular: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M40 65C40 65 15 45 15 30C15 20 25 15 40 25C55 15 65 20 65 30C65 45 40 65 40 65Z" fill="#ef4444" opacity="0.8"/>
        </svg>`,
    respiratory: `<svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <ellipse cx="40" cy="35" rx="20" ry="15" fill="#8b5cf6" opacity="0.8"/>
            <ellipse cx="30" cy="50" rx="12" ry="10" fill="#8b5cf6" opacity="0.6"/>
            <ellipse cx="50" cy="50" rx="12" ry="10" fill="#8b5cf6" opacity="0.6"/>
        </svg>`,
  }
  return icons[category] || icons["pain-relief"]
}

// Format category name
function formatCategory(category) {
  return category
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

// Setup search functionality
function setupSearch() {
  const searchInput = document.getElementById("searchInput")
  if (!searchInput) return

  let searchTimeout

  searchInput.addEventListener("input", (e) => {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
      const query = e.target.value.toLowerCase().trim()
      const activeCategory = document.querySelector(".filter-btn.active")?.dataset.category || "all"
      filterDrugs(query, activeCategory)
    }, 300)
  })
}

// Setup filter functionality
function setupFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      filterButtons.forEach((btn) => btn.classList.remove("active"))
      button.classList.add("active")

      // Filter drugs
      const category = button.dataset.category
      const searchQuery = document.getElementById("searchInput")?.value.toLowerCase().trim() || ""
      filterDrugs(searchQuery, category)
    })
  })
}

// Filter drugs based on search and category
function filterDrugs(searchQuery, category) {
  if (typeof window.drugsData === "undefined") return

  let filteredDrugs = window.drugsData

  // Filter by category
  if (category !== "all") {
    filteredDrugs = filteredDrugs.filter((drug) => drug.category === category)
  }

  // Filter by search query
  if (searchQuery) {
    filteredDrugs = filteredDrugs.filter(
      (drug) =>
        drug.name.toLowerCase().includes(searchQuery) ||
        drug.description.toLowerCase().includes(searchQuery) ||
        drug.uses.some((use) => use.toLowerCase().includes(searchQuery)) ||
        drug.category.toLowerCase().includes(searchQuery),
    )
  }

  displayDrugs(filteredDrugs)
}

// Contact form functionality
function initializeContactForm() {
  const contactForm = document.getElementById("contactForm")
  if (!contactForm) return

  contactForm.addEventListener("submit", function (e) {
    e.preventDefault()

    // Get form data
    const formData = new FormData(this)
    const data = Object.fromEntries(formData)

    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]')
    const originalText = submitBtn.innerHTML
    submitBtn.innerHTML = '<span class="loading"></span> Sending...'
    submitBtn.disabled = true

    // Simulate form submission
    setTimeout(() => {
      // Reset form
      this.reset()

      // Restore button
      submitBtn.innerHTML = originalText
      submitBtn.disabled = false

      // Show success message
      showToast("Message sent successfully! We'll get back to you soon.", "success")

      console.log("Form submitted:", data)
    }, 2000)
  })
}

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

function throttle(func, limit) {
  let inThrottle
  return function () {
    const args = arguments
    
    if (!inThrottle) {
      func.apply(this, args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Form validation utilities
function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePhone(phone) {
  const phoneRegex = /^[+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ""))
}

// Loading state management
function showLoading(element) {
  const originalContent = element.innerHTML
  element.innerHTML = '<span class="loading"></span> Loading...'
  element.disabled = true
  return originalContent
}

function hideLoading(element, originalContent) {
  element.innerHTML = originalContent
  element.disabled = false
}

// Toast notification system
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
        z-index: 10000;
        transition: opacity 0.3s ease, transform 0.3s ease;
        opacity: 0;
        transform: translateY(-20px);
    `;}
     
window.drugsData = [
  {
    name: "Paracetamol",
    category: "pain-relief",
    description: "A widely used pain reliever and fever reducer. Safe and effective when used as directed.",
    dosage: "500mg-1000mg",
    uses: ["Pain relief", "Fever reduction", "Headaches", "Muscle aches"]
  },
  {
    name: "Ibuprofen",
    category: "pain-relief", 
    description: "Anti-inflammatory pain reliever that reduces pain, fever, and inflammation.",
    dosage: "200mg-400mg",
    uses: ["Pain relief", "Anti-inflammatory", "Fever reduction", "Arthritis"]
  },
  {
    name: "Aspirin",
    category: "cardiovascular",
    description: "Pain reliever that also helps prevent heart attacks and strokes in low doses.",
    dosage: "75mg-325mg",
    uses: ["Pain relief", "Heart protection", "Stroke prevention", "Anti-inflammatory"]
  },
  {
    name: "Amoxicillin",
    category: "antibiotics",
    description: "Broad-spectrum antibiotic used to treat various bacterial infections.",
    dosage: "250mg-500mg",
    uses: ["Bacterial infections", "Respiratory infections", "Urinary tract infections", "Skin infections"]
  },
  {
    name: "Azithromycin",
    category: "antibiotics",
    description: "Antibiotic effective against respiratory and skin infections.",
    dosage: "250mg-500mg",
    uses: ["Respiratory infections", "Skin infections", "Sexually transmitted infections", "Ear infections"]
  },
  {
    name: "Lisinopril",
    category: "cardiovascular",
    description: "ACE inhibitor used to treat high blood pressure and heart failure.",
    dosage: "5mg-40mg",
    uses: ["High blood pressure", "Heart failure", "Kidney protection", "Post-heart attack"]
  },
  {
    name: "Metformin",
    category: "cardiovascular",
    description: "First-line medication for type 2 diabetes management.",
    dosage: "500mg-1000mg",
    uses: ["Type 2 diabetes", "Blood sugar control", "Weight management", "PCOS"]
  },
  {
    name: "Albuterol",
    category: "respiratory",
    description: "Bronchodilator inhaler for asthma and breathing difficulties.",
    dosage: "90mcg per puff",
    uses: ["Asthma", "COPD", "Bronchospasm", "Exercise-induced asthma"]
  },
  {
    name: "Montelukast",
    category: "respiratory",
    description: "Leukotriene receptor antagonist for asthma and allergy management.",
    dosage: "10mg daily",
    uses: ["Asthma", "Allergic rhinitis", "Exercise-induced asthma", "Seasonal allergies"]
  },
  {
    name: "Cetirizine",
    category: "respiratory",
    description: "Antihistamine for allergy relief and hay fever symptoms.",
    dosage: "10mg daily",
    uses: ["Allergies", "Hay fever", "Hives", "Itching"]
  },
  {
    name: "Omeprazole",
    category: "pain-relief",
    description: "Proton pump inhibitor for acid reflux and stomach ulcer treatment.",
    dosage: "20mg-40mg",
    uses: ["Acid reflux", "GERD", "Stomach ulcers", "Heartburn"]
  },
  {
    name: "Simvastatin",
    category: "cardiovascular",
    description: "Statin medication to lower cholesterol and reduce heart disease risk.",
    dosage: "10mg-80mg",
    uses: ["High cholesterol", "Heart disease prevention", "Stroke prevention", "Cardiovascular protection"]
  }
];

// Initialize drugs page if we're on the drugs page
document.addEventListener('DOMContentLoaded', function() {
  if (window.location.pathname.includes('drugs') && document.getElementById('drugsGrid')) {
    displayDrugs(window.drugsData);
    setupSearch();
    setupFilters();
  }
});
