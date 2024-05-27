document.addEventListener('DOMContentLoaded', function() {
  fetch('https://emojihub.yurace.pro/api/all')
    .then(response => response.json())
    .then(data => {
      const emojisContainer = document.getElementById('emojis');
      const categoryList = document.getElementById('categoryList');
      const searchInput = document.getElementById('searchInput');
      const searchButton = document.getElementById('searchButton');
      let selectedCategory = "";

      function renderEmojis(emojis) {
        const emojiRow = document.getElementById('emojiRow');
        emojiRow.innerHTML = '';
        emojis.forEach(emoji => {
          const emojiCard = document.createElement('div');
          emojiCard.classList.add('col-md-3', 'mb-3');
          emojiCard.innerHTML = `
            <div class="card emoji-card">
              <div class="card-body text-center">
                <span class="emoji-symbol">${emoji.htmlCode[0]}</span>
                <p>${emoji.name}</p>
                <button class="btn btn-primary btn-copy">Copy Emoji</button>
              </div>
            </div>
          `;
          emojiCard.querySelector('.btn-copy').addEventListener('click', function() {
            const symbol = emojiCard.querySelector('.emoji-symbol').textContent;
            copyToClipboard(symbol);
          });
          emojiRow.appendChild(emojiCard);
        });
      }
      
      function copyToClipboard(text) {
        const el = document.createElement('textarea');
        el.value = text;
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
      }
      
      function renderCategories(categories) {
        categoryList.innerHTML = '';
        categories.forEach(category => {
          const categoryItem = document.createElement('li');
          categoryItem.textContent = category.name;
          categoryItem.addEventListener('click', function() {
            selectedCategory = category.name;
            const filteredEmojis = data.filter(emoji => emoji.group === category.name);
            renderEmojis(filteredEmojis);
          });
          categoryList.appendChild(categoryItem);
        });
      }

      // Group emojis by category
      const groupedEmojis = data.reduce((groups, emoji) => {
        const group = groups.find(group => group.name === emoji.group);
        if (group) {
          group.emojis.push(emoji);
        } else {
          groups.push({ name: emoji.group, emojis: [emoji] });
        }
        return groups;
      }, []);

      renderCategories(groupedEmojis); // Initial rendering

      // Search functionality
      searchButton.addEventListener('click', function(event) {
        event.preventDefault();
        const searchTerm = searchInput.value.toLowerCase();
        let filteredEmojis = data;
        if (selectedCategory) {
          filteredEmojis = filteredEmojis.filter(emoji => emoji.group === selectedCategory);
        }
        filteredEmojis = filteredEmojis.filter(emoji => emoji.name.toLowerCase().includes(searchTerm));
        renderEmojis(filteredEmojis);
      });
    })
    .catch(error => {
      console.log('Error fetching data:', error);
    });
});
