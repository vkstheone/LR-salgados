// Função para carregar feedbacks
async function loadFeedbacks() {
    try {
        const response = await fetch('/feedbacks'); // Rota do backend para obter os feedbacks
        if (!response.ok) {
            throw new Error('Erro ao buscar feedbacks do servidor.');
        }

        const feedbacks = await response.json();
        const testimonialsList = document.querySelector('.testimonials-list');

        if (!testimonialsList) {
            console.error("Elemento .testimonials-list não encontrado no DOM.");
            return;
        }

        // Limpa o conteúdo existente
        testimonialsList.innerHTML = '';

        // Adiciona os feedbacks dinamicamente
        feedbacks.forEach(feedback => {
            const feedbackItem = document.createElement('div');
            feedbackItem.classList.add('testimonial-item');

            feedbackItem.innerHTML = `
                <h3>${feedback.name}</h3>
                <p class="rating">${'★'.repeat(feedback.rating)}${'☆'.repeat(5 - feedback.rating)}</p>
                <p>${feedback.comment}</p>
                <button class="delete-btn" data-id="${feedback.id}">🗑️</button>
            `;

            testimonialsList.appendChild(feedbackItem);
        });
    } catch (error) {
        console.error("Erro ao carregar feedbacks:", error.message);
    }
}

// Função para excluir um feedback
async function deleteFeedback(feedbackId) {
    try {
        const response = await fetch(`/feedbacks/${feedbackId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Erro ao excluir feedback.');
        }

        const result = await response.json();
        console.log(result.message);

        // Recarrega os feedbacks após a exclusão
        loadFeedbacks();
    } catch (error) {
        console.error("Erro ao excluir feedback:", error.message);
    }
}

// Adiciona eventos para os botões de exclusão
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const feedbackId = event.target.getAttribute('data-id');

        if (confirm('Tem certeza que deseja excluir este feedback?')) {
            deleteFeedback(feedbackId); // Chama a função para excluir o feedback
        }
    }
});

// Aguarda o carregamento do DOM antes de executar
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado.");
    loadFeedbacks(); // Carrega os feedbacks ao iniciar
});
