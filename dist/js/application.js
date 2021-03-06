var serveur="https://trankillprojets.fr/P4/?";
var timer=null;

var pseudo="";
var pseudoAdversaire="";
var numero=0;
var tour=0;
var etat="";
var carte=[];
var message="";

var echange=0;

function interfaces()
{
  if(!pseudo||pseudo.length==0)
    {
      // Si l'identifiant n'est pas connu, on affiche l'interface de demande de pseudo
      document.querySelector("#inscription").style.display="flex";
      document.querySelector("#connecte").style.display="none";
      document.querySelector("#partie").style.display="none";

      document.querySelector("#info1_inscription").innerHTML=message;
    }
  else
    {
      if(!pseudoAdversaire||pseudoAdversaire.length==0)
        {
          // S'il n'y a pas d'adversairer
          document.querySelector("#inscription").style.display="none";
          document.querySelector("#connecte").style.display="flex";
          document.querySelector("#partie").style.display="none";

          document.querySelector("#info1_connecte").innerHTML=message;
        }
      else
        {
          // S'il y a un adversaire
          document.querySelector("#inscription").style.display="none";
          document.querySelector("#connecte").style.display="none";
          document.querySelector("#partie").style.display="flex";

          document.querySelector("#info1_partie").innerHTML=message

          for(let i=0;i<6;i++)
            {
              for(let j=0;j<7;j++)
                {
                  if(carte[i][j]==0) document.querySelector("#p"+i.toString()+j.toString()).src="vide.jpg";
                  if(carte[i][j]==1) document.querySelector("#p"+i.toString()+j.toString()).src="rond.jpg";
                  if(carte[i][j]==2) document.querySelector("#p"+i.toString()+j.toString()).src="croix.jpg";
                }
            }
        }
    }
}

function inscription() // OK
{
  var pseudonyme=document.querySelector("#pseudo").value;
  var requete=serveur+"inscription&pseudo="+pseudonyme;

  echange=0;
  fetch(requete)
  .then(function(response)
    {
      response.json().then(function(data) {
      if(data.etat=="OK")
        {
          echange=1;
          // On affecte la valeur d'identifiant recu du serveur à la variable globale identifiant
          document.querySelector("#identifiant").value=data.identifiant;
          pseudo=data.pseudo;
          message="Vous etes connecté";
        }
      else
        {
          // le serveur répond KO car le pseudo est déjà affecté
          pseudo="";
          message="Pseudo deja utilisé";
        }
      });
    })
  .catch(function(response)
    {
      // Il y a eu une erreur réseau lors de la prise de contacte avec le serveur
      pseudo="";
      message="Veuillez essayer à nouveau";
    });
}

function connexion()
{
  echange=1;
  traitement();
}

function deconnexion()
{
  document.querySelector("#identifiant").value="";
  pseudo="";
  pseudoAdversaire="";
  numero=0;
  tour=0;
  etat="";
  carte=[];
  message="";
  echange=0;
}

function participer()
{
  if(document.querySelector("#identifiant").value.length==0) return;
  var requete=serveur+"participer&identifiant="+document.querySelector("#identifiant").value;

  echange=0;

  fetch(requete)
  .then(function(response)
    {
      response.json().then(function(data) {
      if(data.etat=="En attente"||data.etat=="En cours")
        {
          echange=1;
          // On affecte la valeur d'identifiant recu du serveur à la variable globale identifiant
          pseudo=data.pseudo;
        }
      else
        {
          // le serveur répond KO car le pseudo est déjà affecté
          pseudo="";
        }
      });
    })
  .catch(function(response)
    {
      // Il y a eu une erreur réseau lors de la prise de contacte avec le serveur
      pseudo="";
    });
}

function position(p)
{
  if(document.querySelector("#identifiant").value.length==0) return;
  if(tour!=numero) return;

  var requete=serveur+"jouer&position="+p.toString()+"&identifiant="+document.querySelector("#identifiant").value;

  echange=0;

  fetch(requete)
  .then(function(response)
    {
      echange=1;
      // On ne fait rien de la reponse du serveur
      response.json().then(function(data) {

      });
    })
  .catch(function(response)
    {
      // Il y a eu une erreur réseau lors de la prise de contacte avec le serveur
      pseudo="";
      message="Vous avez été déconnecté, essayer à nouveau";
    });
}

function traitement()
{
  if(echange==1&&document.querySelector("#identifiant").value.length!=0)
    {
      var requete=serveur+"statut&identifiant="+document.querySelector("#identifiant").value;

      message="";

      fetch(requete)
      .then(function(response)
        {
          response.json().then(function(data) {

          if(data.etat=="OK"||data.etat=="En attente")
            {
              // On affecte la valeur d'identifiant recu du serveur à la variable globale identifiant
              pseudoAdversaire="";
              tour=0;
              carte=[];
              pseudo=data.pseudo;
              numero=data.joueur;
              message="Bonjour "+pseudo;
            }
          else if(data.etat=="En cours"||data.etat=="joueur 1 gagne"||data.etat=="joueur 2 gagne"||data.etat=="Match nul")
            {
              // On est dans une partie
              pseudo=data.pseudo;
              pseudoAdversaire=data.adversaire;
              tour=data.tour;
              carte=data.carte;
              numero=data.joueur;
              etat=data.etat;

              let n2=1;
              if(numero==1) n2=2;

              if(etat=="En cours")
                {
                  if(tour==numero) message=pseudo+"("+numero+") contre "+pseudoAdversaire+"("+n2+"), à vous de jouer...";
                  else message=pseudo+"("+numero+") contre "+pseudoAdversaire+"("+n2+"), à votre adversaire de jouer...";
                }
              else
                {
                  message=pseudo+"("+numero+") contre "+pseudoAdversaire+"("+n2+"), "+etat;
                  echange=0;
                }
            }
          else
            {
              // le serveur répond KO car le pseudo est déjà affecté
              pseudo="";
              pseudoAdversaire="";
              tour=0;
              carte=[];
              numero=0;
              message="Impossible de se connecter avec cet identifiant";
            }
          interfaces();
          setTimeout(function(){ traitement(); }, 1000);
          });
        })
      .catch(function(response)
        {
          // Il y a eu une erreur réseau lors de la prise de contacte avec le serveur
          pseudo="";
          pseudoAdversaire="";
          tour=0;
          carte=[];
          numero=0;
          message="veuillez essayer à nouveau";
          interfaces();
          setTimeout(function(){ traitement(); }, 1000);
        });
    }
  else
    {
      interfaces();
      setTimeout(function(){ traitement(); }, 1000);
    }
}

traitement();
