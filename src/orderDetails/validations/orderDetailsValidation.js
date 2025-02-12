
const paginate = (pages, sizes) => {
    const page = isNaN(parseInt(pages)) || parseInt(pages) < 1 ? 1 : parseInt(pages);
    const size = isNaN(parseInt(sizes)) || parseInt(sizes) < 1 ? 10 : parseInt(sizes);
    const offset = (page - 1) * size;

    return { page, size, offset };
};

module.exports = paginate;
