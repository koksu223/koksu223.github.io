$(function () {
    $('.nav-btn').on('click', function () {
        $(this).toggleClass('open');
    });
});

$(document).ready(function () {
    $(window).scroll(function () {
        var scroll = $(window).scrollTop();
        if (scroll > 100) {
            $("#header").addClass('glass-effect');
        } else {
            $("#header").removeClass("glass-effect");
        }
    });

    $(".tab").click(function () {
        let tabs = $(this).closest('.tabs');
        let tabContent = tabs.siblings('.tab-content');
        let backgroundContainer = tabs.siblings('.background-container');

        // Hapus kelas "active" dari semua tab dan tambahkan ke tab yang dihover
        tabs.find('.tab').removeClass('active');
        $(this).addClass("active");

        // Sembunyikan semua konten dan tampilkan yang sesuai dengan tab yang dihover
        let selectedTab = $(this).data("tab");
        tabContent.find(".content").removeClass("active");
        tabContent.find("#" + selectedTab).addClass("active");
    });
})

function animateNumber($element, targetNumber, duration, decimals) {
    const startTime = performance.now();
    const startNumber = 0;

    function updateNumber(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const currentNumber = startNumber + progress * (targetNumber - startNumber);

        $element.text(currentNumber.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        }));

        if (progress < 1) {
            requestAnimationFrame(updateNumber);
        }
    }

    requestAnimationFrame(updateNumber);
}

function checkScroll() {
    $('.number').each(function () {
        const $el = $(this);

        if (!$el.hasClass('animated')) {
            const targetValue = parseFloat($el.attr("data-target"));
            const durationValue = parseInt($el.attr("data-duration"), 10);
            const decimals = ($el.attr("data-target").split(".")[1] || "").length;

            const rect = this.getBoundingClientRect();
            if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                animateNumber($el, targetValue, durationValue, decimals);
                $el.addClass('animated');
            }
        }
    });
}

// Scroll listener
$(window).on('scroll', checkScroll);

// Jalankan saat halaman load
$(window).on('load', checkScroll);


$(document).ready(function () {
    $('.marquee-container').each(function () {
        const cont = $(this); // Mengambil marquee-container saat ini
        const content = cont.find('.marquee-content');
        const clone = content.clone();
        const clone2 = clone.clone();
        cont.append(clone);
        cont.append(clone2); // Clone hanya untuk container ini

        cont.find('.marquee-content').addClass('marquee'); // Tambahkan class marquee pada konten yang di-clone
    });
});

$(document).ready(function () {
    let targetDate = new Date("Jan 1, 2027 00:00:00").getTime();

    let countdown = setInterval(function () {
        let now = new Date().getTime();
        let distance = targetDate - now;

        if (distance < 0) {
            clearInterval(countdown);
            $(".countdown").html("New Application!");
            return;
        }

        let days = Math.floor(distance / (1000 * 60 * 60 * 24));
        let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((distance % (1000 * 60)) / 1000);

        $("#days").text(days);
        $("#hours").text(hours);
        $("#minutes").text(minutes);
        $("#seconds").text(seconds);
    }, 1000);
});

$(document).ready(function () {
    var $header = $('#header');
    var $navLinks = $('.navbar-nav .nav-link');

    function getScrollOffset() {
        return ($header.outerHeight() || 0) + 40;
    }

    function scrollToTarget(hash) {
        var $target = $(hash);
        if (!$target.length) {
            return false;
        }

        var targetPosition = Math.max(0, $target.offset().top - getScrollOffset());
        $('html, body').stop(true, true).animate({
            scrollTop: targetPosition
        }, 10, 'swing', function () {
            updateActiveNav();
        });
        return true;
    }

    function updateActiveNav() {
        var scrollPosition = $(window).scrollTop() + getScrollOffset() + 5;
        var activeLink = null;

        $navLinks.each(function () {
            var href = $(this).attr('href') || '';
            var hashIndex = href.indexOf('#');
            if (hashIndex < 0) {
                return;
            }
            var hash = href.slice(hashIndex);
            if (!hash || hash === '#') {
                return;
            }

            var $section = $(hash);
            if (!$section.length) {
                return;
            }

            var sectionTop = $section.offset().top;
            var sectionBottom = sectionTop + $section.outerHeight();

            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeLink = this;
            }
        });

        $navLinks.removeClass('active');

        if (activeLink) {
            $(activeLink).addClass('active');
        } else {
            if ($(window).scrollTop() < getScrollOffset()) {
                $navLinks.filter(function () {
                    var href = $(this).attr('href') || '';
                    return href.indexOf('#') >= 0 && href.slice(href.indexOf('#')) === '#';
                }).addClass('active');
            }
        }
    }

    $navLinks.on('click', function (event) {
        var href = $(this).attr('href') || '';
        var hashIndex = href.indexOf('#');
        if (hashIndex < 0) {
            return;
        }

        var hash = href.slice(hashIndex);
        var linkPath = this.pathname ? this.pathname.split('/').pop() : '';
        var currentPath = window.location.pathname.split('/').pop();

        if (hash && (linkPath === currentPath || linkPath === '' || currentPath === '' || (linkPath === 'index.html' && currentPath === 'index.html'))) {
            event.preventDefault();
            $('.navbar-collapse').collapse('hide');
            if (hash === '#') {
                $('html, body').stop(true, true).animate({
                    scrollTop: 0
                }, 450, 'swing', function () {
                    updateActiveNav();
                });
                window.history.pushState(null, '', hash);
                return;
            }

            if (scrollToTarget(hash)) {
                window.history.pushState(null, '', hash);
            }
        }
    });

    $(window).on('scroll', updateActiveNav);
    $(window).on('load', function () {
        if (window.location.hash) {
            scrollToTarget(window.location.hash);
        }
        updateActiveNav();
    });
});

$(document).ready(function () {
    var currentIncidents = 0;
    var targetIncidents = 0;
    var $incidentNumber = $('.incident-number');
    var isAnimating = false;

    function animateToTarget() {
        if (currentIncidents < targetIncidents) {
            $incidentNumber.addClass('incrementing');
            currentIncidents++;
            var $newSpan = $('<span>').text(currentIncidents);
            $incidentNumber.html($newSpan);
            setTimeout(animateToTarget, 80);
        } else {
            $incidentNumber.removeClass('incrementing');
            isAnimating = false;
            var delay = Math.floor(Math.random() * 3000) + 2000;
            setTimeout(scheduleNextUpdate, delay);
        }
    }

    function scheduleNextUpdate() {
        var increment = Math.floor(Math.random() * 30) + 1;
        targetIncidents = currentIncidents + increment;
        isAnimating = true;
        animateToTarget();
    }

    var initialDelay = Math.floor(Math.random() * 3000) + 2000;
    setTimeout(scheduleNextUpdate, initialDelay);
});


