var jsmediatags = require("jsmediatags");

export default async (req, res) => {
    try {
        const { ipfsHash } = req.query;

        const url = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;

        return new jsmediatags.Reader(url)
            .setTagsToRead(["picture"])
            .read({
                onSuccess: function (tag) {
                    var tags = tag.tags;
                    if (!tags.picture)
                        return res.json({ picUrl: null });

                    var picUrl = "data:" + tags.picture.format + ";base64, " + Buffer.from(tags.picture.data).toString('base64');
                    return res.json({ picUrl: picUrl });
                },
                onError: function (error) {
                    return res.status(500).json({ "error": error.toString() });
                }
            });
    } catch (e) {
        return res.status(500).json({ "error": e.toString() });
    }
}
