async function loadFeedbacks() {
    try {
        const response = await fetch('http://localhost:3000/database/feedbacks'); // Rota do backend para obter os feedbacks
        if (!response.ok) {
            throw new Error('Erro ao buscar feedbacks do servidor   .');
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
async function deleteFeedback(feedbackId, userEmail) {
    try {
        const response = await fetch(`http://localhost:3000/feedbacks/${feedbackId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: userEmail }) // Agora o email é enviado corretamente
        });

        if (!response.ok) {
            const errorData = await response.json(); // Captura a mensagem de erro do backend
            throw new Error(errorData.message || 'Erro ao excluir feedback.');
        }

        const result = await response.json();
        console.log(result.message);

        // Atualiza a lista de feedbacks
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
                    return false; // Impede o fechamento do modal se o email estiver vazio
                }
                return email;
            }
        }).then((result) => {
            if (result.isConfirmed && result.value) {
                deleteFeedback(feedbackId, result.value); // Agora passando o email corretamente
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
        //const response = await fetch('../../../back-end/database/feedbacks');// Rota do backend para obter os feedbacks
        const response = await fetch('http://localhost:3000/feedbacks');

        
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