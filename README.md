Atividade Avaliativa 1 — Qualidade de Software na Prática com CI/CD

Aplicar conceitos de qualidade de software por meio da implementação de testes automatizados, integração contínua e revisão de código automatizada.

Essa atividade avaliativa deve ser realizada em dupla, cujo objetivo é desenvolver ou adaptar uma aplicação web simples e implementar práticas de qualidade de software, incluindo:
Testes Unitários

Funções JavaScript, regras de negócio, validações, manipulação de dados
Pipeline de CI/CD

O pipeline deverá fornecer feedback automático ao desenvolvedor, incluindo no mínimo o status da execução (sucesso ou falha) e logs dos testes. Como diferencial, poderão ser incluídos relatórios de cobertura de testes, comentários automáticos em Pull Requests ou notificações de deploy.
Deploy automatizado (github pages)

Cada dupla poderá optar por uma de duas abordagens para o desenvolvimento da aplicação: (1) uma aplicação totalmente frontend (estática), desenvolvida em JavaScript e executada no navegador, como por exemplo landing pages com formulários, calculadoras ou aplicações simples de interação, sendo compatível com publicação no GitHub Pages; ou (2) uma aplicação com integração a backend, na qual o frontend será igualmente publicado no GitHub Pages, mas consumirá um serviço externo (API) utilizando plataformas BaaS como Supabase. Nesta segunda abordagem, não será necessário desenvolver ou realizar deploy de servidor próprio, sendo o backend disponibilizado como serviço. Em ambos os casos, a escolha deve ser justificada pelo grupo e a aplicação deverá contemplar obrigatoriamente a implementação de testes automatizados e pipeline de integração contínua.
Revisão de código com ferramenta automatizada (github apps)

Deverá ser implementado um processo de revisão de código automatizada utilizando GitHub Apps, como o Gemini Code Assist, Qodo, ou ferramenta equivalente, integrado ao repositório. É obrigatório criar ao menos um Pull Request (PR) durante o desenvolvimento, no qual a ferramenta realizará análises automáticas e gerará comentários sobre o código. A dupla deverá analisar criticamente esses apontamentos e responder às sugestões, realizando ajustes quando necessário. 
Exigir Pull Request para merge na main/master

Adicionalmente, o repositório deverá ser configurado para exigir obrigatoriamente a utilização de Pull Requests para integração na branch principal (main/master), com a execução automática da pipeline de CI via GitHub Actions, sendo condição para aprovação que a pipeline seja concluída com sucesso.


Sugestões de projetos nesse modelo

To-do list com persistência
Sistema de cadastro de usuários
App de notas com login
Controle financeiro com armazenamento


Entregáveis

Link do repositório no GitHub, contendo todo o código-fonte do projeto. Adicionar o usuário guilherme-ferraz ao repositório com permissão de escrita (Write);

Arquivo README.md completo, contendo descrição da aplicação desenvolvida; justificativa da escolha do tipo de projeto (frontend estático ou integração com backend); explicação das principais decisões técnicas adotadas; instruções para execução do projeto; descrição do funcionamento da pipeline e dos testes;

Link da aplicação publicada (quando aplicável), utilizando o GitHub Pages;

As duplas deverão realizar uma demonstração prática em sala, apresentando o funcionamento da aplicação, a execução dos testes, a pipeline em funcionamento, o processo de Pull Request com restrição (necessidade de aprovação) na main e com revisão automatizada;

Data limite de entrega: 14/04/2026;

