
const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require("discord.js");
const { prefix, owner } = require("../../config.json");
const moment = require("moment")
const SpotifyWebApi = require('spotify-web-api-node');
const { QuickDB } = require("quick.db")
const db = new QuickDB()

module.exports = {
	// The data needed to register slash commands to Discord.
	data: new SlashCommandBuilder()
		.setName("spotify")
		.setDescription("What are you listening to")
    .addSubcommand(subcommand => 
      subcommand
        .setName("activity")
        .setDescription("Shows the activity you are playing now")
        .addUserOption((option) => option.setName("user").setDescription("The specific user to see the info of").setRequired(false))
    )
    .addSubcommand(subcommand =>
      subcommand
        .setName("search")
        .setDescription("Search the spotify tracks or artists")
        .addStringOption((option) => 
          option
            .setName("artist")
            .setDescription("Search for the artist by provide a name")
            .setRequired(false)
        )
        .addStringOption((option) => 
          option
            .setName("track")
            .setDescription("Search for the track by provide a name")
            .setRequired(false)
        )
    ),
  category: "fun",
  usage: "/spotify activity || /spotify search <artist> or <track>",
  
	async execute(client, interaction, args) {
    
    // Spotify API
    let spotifyApi = new SpotifyWebApi({
      clientId: process.env.spotifyClient,
      clientSecret: process.env.spotifyClientSecret,
    })
    
    let spotifyToken = db.table("spotifyToken")
    let spotifyRefreshToken = db.table("spotifyRefreshToken")
    let token = await spotifyToken.get("spotifyToken")
    let refreshToken = await spotifyRefreshToken.get("spotifyRefreshToken")
    
    spotifyApi.setAccessToken(token)
    spotifyApi.setRefreshToken(refreshToken)
    
    const refresh = await spotifyApi.refreshAccessToken();
    const access_token = refresh.body["access_token"];
    
    spotifyToken.set("spotifyToken", access_token)
    
    console.log("The access token has been refreshed!");
    console.log("access_token:", access_token);
    
    spotifyApi.setAccessToken(access_token);
    
    let activityEmbed = new EmbedBuilder()
    .setColor("#ffd500")
    
    // Spotify Activity (sub commannds)
    let activity = interaction.options.getSubcommand() === "activity"
    // Spotify Search (sub commands)
    let search = interaction.options.getSubcommand() === "search"
    
    if (activity) {
      let user = interaction.options.getUser("user")
      
      if (!user) {
        let status = interaction.member.presence.activities.find(x => x.name === "Spotify")
        
        if (status && [2, 4].includes(status.type)) {
          let trackNamePresence = status.details;
          let trackAuthorPresence = status.state;
          
          let data = await spotifyApi.searchTracks(`track:${trackNamePresence} artist:${trackAuthorPresence}`)
          data = data.body.tracks.items.find(x => x.name === trackNamePresence)
          
          if (data == undefined) {
            let data = await spotifyApi.searchTracks(`artist:${trackAuthorPresence}`)
            data = data.body.tracks.items.find(x => x.name === trackNamePresence)
  
            let trackName = data.name
            let trackPopularity = data.popularity
            let trackURL = data.external_urls.spotify
            let trackAuthor = trackAuthorPresence
            
            activityEmbed.addFields({ name: 'Nama Track:', value: trackName, inline: true })
            activityEmbed.addFields({ name: 'Album:', value: status.assets.largeText || `Tidak ada Album`, inline: true })
            activityEmbed.addFields({ name: 'Artist:', value: trackAuthor, inline: false })
            activityEmbed.addFields({ name: 'Popularity:', value: `${trackPopularity}%`, inline: false })
            activityEmbed.addFields({ name: 'Track URL:', value: `${trackURL}` || `Tidak ada Track URL`, inline: false })
          } else if (data.name === trackNamePresence) {
            let trackName = data.name
            let trackPopularity = data.popularity
            let trackURL = data.external_urls.spotify
            let trackAuthor = trackAuthorPresence
            
            activityEmbed.addFields({ name: 'Nama Track:', value: trackName, inline: true })
            activityEmbed.addFields({ name: 'Album:', value: status.assets.largeText || `Tidak ada Album`, inline: true })
            activityEmbed.addFields({ name: 'Artist:', value: trackAuthor, inline: false })
            activityEmbed.addFields({ name: 'Popularity:', value: `${trackPopularity}%`, inline: false })
            activityEmbed.addFields({ name: 'Track URL:', value: `${trackURL}` || `Tidak ada Track URL`, inline: false })
          }
          
          activityEmbed.setAuthor({ 
            name: `${interaction.user.username} sedang mendengarkan Spotify`, 
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
          })
          activityEmbed.setThumbnail(`https://i.scdn.co/image/${status.assets.largeImage.slice(8)}` || null)
          activityEmbed.setFooter({
            text: `Developed from Fyy#2195 ❤️`, 
            iconURL: `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`
          })
          activityEmbed.setTimestamp()
          interaction.reply({ embeds: [activityEmbed] })
          
       } else {
         let errorEmbed = new EmbedBuilder()
         .setColor("#ffd500")
         .setAuthor({ name: `Spotify tidak terdeteksi.`, iconURL: interaction.user.displayAvatarURL({ dynamic: true }) })
         .setDescription(`Maaf sepertinya kamu sedang tidak mendengarkan **Spotify** atau kamu tidak membagikan activities kamu di **Discord**, atau juga belum menambahkan akun **Spotify mu ke Discord.**\n[Pelajari disini cara menambahkan akun Spotify ke Discord](https://support.spotify.com/id/article/discord-and-spotify/)`)
         interaction.reply({ embeds: [errorEmbed] })
       }
      } else if (user) {
        let userString = interaction.options.getUser("user")
        let user = interaction.guild.members.cache.get(userString.id)
              let status = interaction.guild.members.cache.get(user.id).presence.activities.find(x => x.name === "Spotify")
        if (status && [2, 4].includes(status.type)) {
          let trackNamePresence = status.details;
          let trackAuthorPresence = status.state;
          
          let data = await spotifyApi.searchTracks(`track:${trackNamePresence} artist:${trackAuthorPresence}`)
          data = data.body.tracks.items.find(x => x.name === trackNamePresence)
          
          if (data == undefined) {
            let data = await spotifyApi.searchTracks(`artist:${trackAuthorPresence}`)
            data = data.body.tracks.items.find(x => x.name === trackNamePresence)
            let trackName = data.name
            let trackPopularity = data.popularity
            let trackURL = data.external_urls.spotify
            let trackAuthor = trackAuthorPresence
            
            activityEmbed.addFields({ name: 'Nama Track:', value: trackName, inline: true })
            activityEmbed.addFields({ name: 'Album:', value: status.assets.largeText || `Tidak ada Album`, inline: true })
            activityEmbed.addFields({ name: 'Artist:', value: trackAuthor, inline: false })
            activityEmbed.addFields({ name: 'Popularity:', value: `${trackPopularity}%`, inline: false })
            activityEmbed.addFields({ name: 'Track URL:', value: `${trackURL}` || `Tidak ada Track URL`, inline: false })
          } else if (data.name === trackNamePresence) {
            let trackName = data.name
            let trackPopularity = data.popularity
            let trackURL = data.external_urls.spotify
            let trackAuthor = trackAuthorPresence
            
            activityEmbed.addFields({ name: 'Nama Track:', value: trackName, inline: true })
            activityEmbed.addFields({ name: 'Album:', value: status.assets.largeText || `Tidak ada Album`, inline: true })
            activityEmbed.addFields({ name: 'Artist:', value: trackAuthor, inline: false })
            activityEmbed.addFields({ name: 'Popularity:', value: `${trackPopularity}%`, inline: false })
            activityEmbed.addFields({ name: 'Track URL:', value: `${trackURL}` || `Tidak ada Track URL`, inline: false })
          }
          
          activityEmbed.setAuthor({ 
            name: `${user.user.tag} sedang mendengarkan Spotify`, 
            iconURL: user.displayAvatarURL({ dynamic: true }) 
          })
          activityEmbed.setThumbnail(`https://i.scdn.co/image/${status.assets.largeImage.slice(8)}` || null)
          activityEmbed.setFooter({
            text: `Developed from Fyy#2195 ❤️`, 
            iconURL: `https://i.scdn.co/image/${status.assets.largeImage.slice(8)}`
          })
          activityEmbed.setTimestamp()
          await interaction.reply(`${interaction.user} menggunakan command \`/spotify activity\` ke ${user}`)
          await interaction.followUp({ embeds: [activityEmbed] })
          
        } else {
          let errorEmbed = new EmbedBuilder()
          .setColor("#ffd500")
          .setAuthor({ name: `Spotify tidak terdeteksi.`, iconURL: user.displayAvatarURL({ dynamic: true }) })
          .setDescription(`Maaf sepertinya ${user} sedang tidak mendengarkan **Spotify** atau ${user} tidak membagikan activitiesnya di **Discord**, atau juga belum menambahkan akun **Spotify nya ke Discord.**\n[Beritahu dia cara menambahkan akun Spotify ke Discord](https://support.spotify.com/id/article/discord-and-spotify/)`)
          await interaction.reply(`${interaction.user} menggunakan command \`/spotify activity\` ke ${user}`)
          await interaction.followUp({ embeds: [errorEmbed] })
        }
      }
    } else if (search) {
      let searchEmbed = new EmbedBuilder()
      .setColor("#ffd500")
      
      let artistString = interaction.options.getString("artist")
      let trackString = interaction.options.getString("track")
      
      if (artistString) {
        let data = await spotifyApi.searchArtists(artistString)
        data = data.body.artists.items.find(x => x.name.toLowerCase().match(artistString.toLowerCase()))
        if (data == undefined) return interaction.reply("Harap masukkan nama artist yang benar.")
        
        let foundArtistName = data.name
        let foundArtistFollowers = `${data.followers.total}`
        let foundArtistGenres = data.genres.map(x => x).join(", ")
        const arr = foundArtistGenres.split(" ");
        for (var i = 0; i < arr.length; i++) {
          arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].slice(1);
        }
        foundArtistGenres = arr.join(" ")
        
        let foundArtistPopularity = data.popularity
        let foundArtistURL = data.external_urls.spotify
        let foundArtistThumbnail = data.images[0].url || null
        
        searchEmbed.addFields({ name: 'Nama Artist:', value: foundArtistName, inline: true })
        searchEmbed.addFields({ name: 'Followers:', value: `${foundArtistFollowers.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}` || `Tidak ada Album`, inline: true })
        searchEmbed.addFields({ name: 'Genre:', value: foundArtistGenres || "No genres", inline: false })
        searchEmbed.addFields({ name: 'Popularity:', value: `${foundArtistPopularity}%`, inline: false })
        searchEmbed.addFields({ name: 'Artist URL:', value: `${foundArtistURL}` || `Tidak ada Track URL`, inline: false })
        searchEmbed.setAuthor({ 
            name: `${interaction.user.username} search type: Artist`, 
            iconURL: interaction.user.displayAvatarURL({ dynamic: true }) 
        })
        searchEmbed.setFooter({
            text: `Developed from Fyy#2195 ❤️`, 
            iconURL: interaction.user.displayAvatarURL({ dynamic: true })
        })
        searchEmbed.setThumbnail(foundArtistThumbnail)
        
        return interaction.reply({ embeds: [searchEmbed] })
      } else if (trackString) {
        return interaction.reply("Work in progress. Stay tune!")
      } else {
        return interaction.reply("Kamu harus memilih salah satu options.  ")
      }
    }
	}
};
