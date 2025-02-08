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
                <p>'${feedback.comment}</p>
                <button class="delete-btn" data-id="${feedback.id}">Excluir Comentário</button>
            `;
            
            testimonialsList.appendChild(feedbackItem);
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: `Erro ao carregar feedbacks: ${error.message}`
        });
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

// Adiciona eventos para os botões de exclusão
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('delete-btn')) {
        const feedbackId = event.target.getAttribute('data-id');

        Swal.fire({
            title: 'Tem certeza?',
            text: 'Você deseja excluir este feedback?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, excluir!',
            confirmButtonColor: '#ff9c5b',
            cancelButtonText: 'Cancelar',
        }).then((result) => {
            if (result.isConfirmed) {
                deleteFeedback(feedbackId); // Chama a função para excluir o feedback
            }
        });
    }
});

// Aguarda o carregamento do DOM antes de executar
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM completamente carregado.");
    loadFeedbacks(); // Carrega os feedbacks ao iniciar
});

// Função para carregar feedbacks
async function loadFeedbacks() {
    try {
        const response = await fetch('/feedbacks'); // Rota do backend para obter os feedbacks
        if (!response.ok) {
            throw new Error('Erro ao buscar feedbacks do servidor.');
        }

        const feedbacks = await response.json();
        console.log('Feedbacks recebidos:', feedbacks); // Adicionando um log para verificar os dados

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
                <button class="delete-btn" data-id="${feedback.id}">Excluir Comentário</button>
            `;
            
            testimonialsList.appendChild(feedbackItem);
        });
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Erro!',
            text: `Erro ao carregar feedbacks: ${error.message}`
        });
    }
}