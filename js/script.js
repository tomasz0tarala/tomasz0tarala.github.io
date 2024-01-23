// pop-up
document.addEventListener("DOMContentLoaded", function() {
    var popup = document.getElementById("popup");
    var closeBtn = document.getElementsByClassName("close")[0];
  
    // Pokazuje pop up po załadowaniu strony
    setTimeout(function() {
      popup.style.display = "block";
    }, 2000); // 2000ms = 2s
  
    // Zamyka pop up po kliknięciu w X
    closeBtn.onclick = function() {
      popup.style.display = "none";
    };
  
    // Zamyka pop up po kliknięciu w dowolne miejsce na ekranie
    window.onclick = function(event) {
      if (event.target == popup) {
        popup.style.display = "none";
      }
    };
  
    // Zapisuje email do newslettera po kliknięciu w "Zapisz się"
    document.getElementById("newsletter-form").onsubmit = function(event) {
      event.preventDefault(); //  Nie wysyła formularza
      var email = document.getElementById("email").value;
      
      alert("Dziękujemy za zapisanie się do newslettera: " + email);
      popup.style.display = "none";
    };
  });
  

// hamburger menu
document.addEventListener("DOMContentLoaded", function() {
    var hamburger = document.querySelector('.hamburger-menu');
    var mobileNav = document.querySelector('.mobile-nav ul');

    hamburger.addEventListener('click', function() {
        mobileNav.classList.toggle('active');
    });

});

// contact form
window.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('contactForm').style.transform = 'scale(1)';
  });
  
//   slider
let slideIndex = 1;
showSlides(slideIndex);

function changeSlide(n) {
  showSlides(slideIndex += n);
}

function currentSlide(n) {
  showSlides(slideIndex = n);
}

function showSlides(n) {
  let i;
  let slides = document.getElementsByClassName("slide");
  let dots = document.getElementsByClassName("dot");
  if (n > slides.length) { slideIndex = 1 }
  if (n < 1) { slideIndex = slides.length }
  for (i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
  }
  for (i = 0; i < dots.length; i++) {
      dots[i].className = dots[i].className.replace(" active", "");
  }
  slides[slideIndex-1].style.display = "block";
  dots[slideIndex-1].className += " active";
}

// zakladki
document.querySelectorAll('.tab-label').forEach((label) => {
    label.addEventListener('click', () => {
      const content = label.nextElementSibling;
      
      // Jeśli zakładka jest otwarta, zamknij ją.
      if (content.style.maxHeight) {
        content.style.maxHeight = null;
      } else {
        // Zamknij wszystkie inne zakładki.
        document.querySelectorAll('.tab .tab-content').forEach((otherContent) => {
          otherContent.style.maxHeight = null;
        });
        // Ustaw wysokość na maksymalną, aby otworzyć zakładkę.
        content.style.maxHeight = content.scrollHeight + "px";
      }
    });
  });
  
  


