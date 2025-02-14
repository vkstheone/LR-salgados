// scripts.js
async function loadFeedbacks() {
    try {
        const response = await fetch('http://localhost:3000/feedbacks');
        if (!response.ok) {
            throw new Error('Erro ao buscar feedbacks do servidor.');
        }

        const feedbacks = await response.json();
        const testimonialsList = document.querySelector('.testimonials-list');

        if (!testimonialsList) {
            console.error("Elemento .testimonials-list não encontrado no DOM.");
            return;
        }

        testimonialsList.innerHTML = ''; // Limpa o conteúdo existente

        feedbacks.forEach(feedback => {
            const feedbackItem = document.createElement('div');
            feedbackItem.classList.add('testimonial-item');

            feedbackItem.innerHTML = `
                <h3>${feedback.name}</h3>
                <p class="rating">${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</p>
                <p>${feedback.comment}</p>
                <button class="delete-btn" data-id="${feedback.id}">Excluir Comentário</button>
            `;

            testimonialsList.appendChild(feedbackItem);
        });

        // Código de rolagem suave *após* carregar os feedbacks:
        if (window.location.hash) {
            const targetElement = document.querySelector(window.location.hash);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
                setTimeout(showSuccessAlert, 1000); // Aguarda a rolagem antes do alerta
            }
        }
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: `Erro ao carregar feedbacks: ${error.message}`
        });
    }
}

// Função para exibir alerta após rolagem
function showSuccessAlert() {
    let timerInterval;
    Swal.fire({
        title: "Avaliação adidionada com sucesso!",
        icon: 'success',
       
    }).then(() => {
        history.replaceState(null, '', '/index.html');
    });
}

// Função para excluir um feedback
async function deleteFeedback(feedbackId, userEmail) {
    try {
        const response = await fetch(`http://localhost:3000/feedbacks/${feedbackId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail })
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Erro ao excluir feedback.');
        }

        loadFeedbacks();
        Swal.fire({
            icon: 'success',
            title: 'Feedback Excluído!',
            text: 'O feedback foi excluído com sucesso.'
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: `Erro ao excluir feedback: ${error.message}`
        });
    }
}

// Delegação de eventos para excluir comentários
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const feedbackId = event.target.getAttribute('data-id');
        Swal.fire({
            title: 'Digite seu email para confirmar a exclusão',
            input: 'email',
            inputPlaceholder: 'Seu email',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            confirmButtonColor: '#ff9c5b',
            cancelButtonText: 'Cancelar',
            preConfirm: (email) => {
                if (!email) {
                    Swal.showValidationMessage('Por favor, insira um email válido.');
                    return false;
                }
                return email;
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                deleteFeedback(feedbackId, result.value);
            }
        });
    }
});

// Chama loadFeedbacks ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadFeedbacks();
    if (new URLSearchParams(window.location.search).get('comentario') === 'sucesso') {
        window.location.hash = 'testimonials';
    }
});
