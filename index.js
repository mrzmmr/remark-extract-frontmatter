module.exports = function extract(options = {}) {
    return function (tree, file) {
        let name

        if (typeof options === 'function') {
            options.yaml = options
        }

        if (typeof options !== 'function' && options.name) {
            name = options.name
        }

        each(tree, file)

        function each(node) {
            if (extract(node)) {
                return 1
            }

            return every(node)
        }

        function every({ children }) {
            if (!children) {
                return
            }

            for (child of children) {
                if (each(child)) {
                    return 1
                }
            }

            return
        }

        function extract({ type, value }) {
            const check = options[type]

            if (!check || typeof check !== 'function') {
                return
            }

            try {
                const result = check(value)

                if (!result) {
                    return
                }

                if (name) {
                    file.data[name] = file.data[name] || {}

                    Object.assign(file.data[name], result)
                } else {
                    Object.assign(file.data, result)
                }

                return 1
            } catch (error) {
                return maybeThrow(error, type)
            }
        }

        function maybeThrow({ message, column, line, name: type }, name) {
            let method = options.throws
                ? "fail"
                : "message"

            file[method](message, { line, column }, `parseFrontMatter:${name}:${type}`)

            return
        }
    }
}
