// recommendation_page.js

class ActiFlowRecommendations {
  constructor() {
    this.recommendations = [
      {
        id: 1,
        title: "Light Exercise",
        description:
          "Do a light exercise for at least 10 minutes because you have worked for 8 hours. It is essential for maintaining both physical and mental well-being.",
        status: "active",
        timestamp: Date.now() - (4 * 3600 * 1000), 
      },
      {
        id: 2,
        title: "Go to bed earlier",
        description:
          "You have to sleep earlier because you are too exhausted. It is essential to ensure that you get a minimum of 8 hours of sleep each day.",
        status: "active",
        timestamp: Date.now() - (3 * 3600 * 1000), 
      },
      {
        id: 3,
        title: "Good Job for today!",
        description:
          "Thank you for your dedication and hard work. Enjoy your well-earned rest, and I look forward to seeing you refreshed and ready for the tasks ahead.",
        status: "active",
        timestamp: Date.now() - (2 * 3600 * 1000), 
      },
    ];

    this.nextId = 4;
    this.maxRecommendations = 10;
    this.overlayThreshold = 4; 
    this.container = document.getElementById("recommendationsContainer");
    this.addBtn = document.getElementById("addRecommendationBtn");
    this.countTextInline = document.getElementById("countTextInline");
    this.countBreakdown = document.getElementById("countBreakdown");

    this.init();
  }

  init() {
    this.renderRecommendations(); 
    this.updateUI(); 
    if (this.addBtn) {
        this.addBtn.addEventListener("click", () => this.addNewRecommendation());
    }
  }

  updateUI() {
    const activeCount = this.getActiveRecommendations().length;
    const doneCount = this.getDoneRecommendations().length;
    const totalVisibleCount = this.getVisibleRecommendations().length; 

    if (this.countTextInline) {
        this.countTextInline.textContent = `${totalVisibleCount} recommendation${
            totalVisibleCount !== 1 ? "s" : ""
        }`;
    }
    if (this.countBreakdown) {
        this.countBreakdown.textContent = `(${activeCount} active, ${doneCount} completed)`;
    }
    
    if (this.addBtn) {
        if (totalVisibleCount >= this.overlayThreshold) {
            this.addBtn.classList.add("overlay-mode");
            this.addBtn.innerHTML = '<i class="fas fa-plus"></i>'; 
        } else {
            this.addBtn.classList.remove("overlay-mode");
            this.addBtn.innerHTML = '<i class="fas fa-plus"></i> Add Others Recommendation';
        }
    }
  }

  getActiveRecommendations() {
    return this.recommendations.filter((rec) => rec.status === "active");
  }

  getDoneRecommendations() {
    return this.recommendations.filter((rec) => rec.status === "done");
  }

  getVisibleRecommendations() {
    return this.recommendations.filter((rec) => rec.status === "active" || rec.status === "done");
  }

  cleanupOldRecommendations() {
    const visibleRecs = this.getVisibleRecommendations();

    if (visibleRecs.length >= this.maxRecommendations) {
      let oldestRec = null;
      const doneRecs = this.getDoneRecommendations().sort((a, b) => a.timestamp - b.timestamp);
      const activeRecs = this.getActiveRecommendations().sort((a, b) => a.timestamp - b.timestamp);

      if (doneRecs.length > 0) {
        oldestRec = doneRecs[0]; 
      } else if (activeRecs.length > 0) {
        oldestRec = activeRecs[0]; 
      }

      if (oldestRec) {
        oldestRec.status = "rejected"; 
        this.removeRecommendationFromDOM(oldestRec.id);
        this.showNotification("Oldest recommendation removed to make space.");
      }
    }
  }
  
  showNotification(message) {
    const notificationId = 'temp-notification-' + Date.now();
    const notification = document.createElement("div");
    notification.id = notificationId;
    notification.className = 'temp-notification'; 
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10); 

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            const stillExists = document.getElementById(notificationId);
            if (stillExists) {
                stillExists.remove();
            }
        }, 300); 
    }, 3000);
  }


  renderRecommendations() {
    if (!this.container) return;
    this.container.innerHTML = ""; 

    const visibleRecs = this.getVisibleRecommendations();
    
    visibleRecs.sort((a, b) => {
        if (a.status === 'active' && b.status !== 'active') return -1;
        if (a.status !== 'active' && b.status === 'active') return 1;
        return b.timestamp - a.timestamp; 
    });

    visibleRecs.forEach((rec) => { 
      const card = this.createRecommendationCard(rec);
      this.container.appendChild(card);
    });

    this.updateUI();
  }
  
  addRecommendationToDOM(recommendation) {
    if (!this.container) return null;
    const newCard = this.createRecommendationCard(recommendation);
    this.container.insertBefore(newCard, this.container.firstChild); 
    newCard.style.animation = 'recommendationCardSlideInOriginal 0.5s ease-out forwards'; 
    return newCard;
  }

  removeRecommendationFromDOM(id) {
    const card = this.container ? this.container.querySelector(`[data-id="${id}"]`) : null;
    if (card) {
      card.style.animation = "slideOut 0.4s ease-in forwards"; 
      setTimeout(() => {
        if (card.parentNode) {
          card.parentNode.removeChild(card);
        }
      }, 400); 
    }
  }

  // *** EXACTLY MATCHING createRecommendationCard from your original JS file ***
  createRecommendationCard(recommendation) {
    const card = document.createElement("div");
    card.className = "recommendation-card";
    card.dataset.id = recommendation.id;

    if (recommendation.status === "done") {
      card.style.opacity = "0.6";
      card.style.transform = "scale(0.98)";
    }

    const doneButtonContent = // This variable is not directly used in the original HTML structure below
      recommendation.status === "done"
        ? '<i class="fas fa-check-circle"></i> Completed' // Font Awesome (wasn't in original JS for button img)
        : '<i class="fas fa-check"></i> Done'; // Font Awesome (wasn't in original JS for button img)

    const doneButtonStyle = // This variable is not directly used in the original HTML structure below
      recommendation.status === "done"
        ? "background: rgba(76, 175, 80, 0.3);"
        : "";

    const rejectButtonDisplay =
      recommendation.status === "done" ? "display: none;" : "";
    const doneButtonDisabled =
      recommendation.status === "done" ? "disabled" : "";

    // Reverting to the exact HTML structure from your original recommendation_page.js
    // for the action buttons, using <img> tags.
    card.innerHTML = `
                <div class="recommendation-header">${recommendation.title}</div>
                <div class="recommendation-description">${recommendation.description}</div>
                <div class="recommendation-actions">
                <button class="action-btn done-btn" onclick="actiFlowAppGlobal.markAsDone(${recommendation.id})" ${doneButtonDisabled}>
                  <img src="Assets/donebutton.png" alt="Done" style="height: 32px;">
                </button>
                <button class="action-btn reject-btn" onclick="actiFlowAppGlobal.rejectRecommendation(${recommendation.id})" style="${rejectButtonDisplay}">
                  <img src="Assets/rejectbutton.png" alt="Reject" style="height: 32px;">
                </button>
                </div>
            `;
    // Using actiFlowAppGlobal for global access from inline onclick
    return card;
  }
  // *** END OF EXACT MATCH ***

  markAsDone(id) {
    const recommendation = this.recommendations.find((rec) => rec.id === id);
    if (recommendation && recommendation.status === "active") {
      recommendation.status = "done";
      recommendation.timestamp = Date.now(); 

      this.renderRecommendations(); 
      this.updateUI();
      this.showNotification(`"${recommendation.title}" marked as done!`);
    }
  }

  rejectRecommendation(id) {
    const recommendation = this.recommendations.find((rec) => rec.id === id);
    if (recommendation && recommendation.status === 'active') {
      recommendation.status = "rejected"; 
      this.removeRecommendationFromDOM(id); 
      this.updateUI();
      this.showNotification(`"${recommendation.title}" rejected.`);
    }
  }

  addNewRecommendation() {
    this.cleanupOldRecommendations();

    const newRecommendationTemplates = [ 
      { title: "Take a Water Break", description: "You haven't hydrated properly today. Drink at least 2 glasses of water to maintain your energy levels and focus." },
      { title: "Stretch Your Body", description: "You've been sitting for too long. Take 5 minutes to do some basic stretches to improve blood circulation and reduce muscle tension." },
      { title: "Mindfulness Moment", description: "Take a 3-minute break to practice deep breathing or meditation. This will help reduce stress and improve your mental clarity." },
      // ... more templates
    ];

    const randomRecTemplate = newRecommendationTemplates[Math.floor(Math.random() * newRecommendationTemplates.length)];
    const newRecommendation = {
      id: this.nextId++,
      title: randomRecTemplate.title,
      description: randomRecTemplate.description,
      status: "active",
      timestamp: Date.now(),
    };

    this.recommendations.unshift(newRecommendation); 
    
    this.addRecommendationToDOM(newRecommendation);
    this.updateUI(); 

    const newCardElement = this.container ? this.container.querySelector(`[data-id="${newRecommendation.id}"]`) : null;
    if (newCardElement) {
        setTimeout(() => {
            newCardElement.style.boxShadow = "0 6px 20px rgba(74, 92, 58, 0.3)"; 
            setTimeout(() => {
                newCardElement.style.boxShadow = ""; 
            }, 1500);
        }, 500); 
    }
    this.showNotification("New recommendation added!");
  }
}

window.actiFlowAppGlobal = new ActiFlowRecommendations();