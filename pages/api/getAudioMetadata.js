var jsmediatags = require('jsmediatags')

export default async (req, res) => {
  try {
    const { ipfsHash } = req.query

    const url = 'https://gateway.pinata.cloud/ipfs/' + ipfsHash

    return new jsmediatags.Reader(url)
      .setTagsToRead(['picture', 'title', 'artist'])
      .read({
        onSuccess: function (tag) {
          var tags = tag.tags
          var picUrl = null
          var artist = 'Unknown artist'
          var title = 'Untitled'

          if (tags.picture)
            picUrl =
              'data:' +
              tags.picture.format +
              ';base64, ' +
              Buffer.from(tags.picture.data).toString('base64')
          if (tags.artist) artist = tags.artist
          if (tags.title) title = tags.title
          return res.json({ picUrl: picUrl, artist: artist, title: title })
        },
        onError: function (error) {
          return res.status(500).json({ error: error.toString() }).end()
        }
      })
  } catch (e) {
    return res.status(500).json({ error: e.toString() }).end()
  }
}
