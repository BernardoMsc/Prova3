import { Button, StyleSheet, Text, TextInput, FlatList, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";

async function getGame() {
    const resposta = await fetch(`http://177.44.248.50:8080/games`);
    if (resposta.ok) {
        const payload = await resposta.json();
        return payload;
    }
}

async function getGameById(game_id) {
    const resposta = await fetch(`http://177.44.248.50:8080/games/${game_id}`);
    if (resposta.ok) {
        const payload = await resposta.json();
        return payload;
    }
}

async function cadastra(title, slug, price, platform) {
    const resposta = await fetch(`http://177.44.248.50:8080/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, price, platform }),
    });
    return resposta.ok;
}

async function edita(game_id, title, slug, price, platform) {
    const resposta = await fetch(`http://177.44.248.50:8080/games/${game_id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, price, platform }),
    });
    return resposta.ok;
}

async function apaga(game_id) {
    const resposta = await fetch(`http://177.44.248.50:8080/games/${game_id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
    });
    return resposta.ok;
}

export default function Games() {
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [price, setPrice] = useState("");
    const [platform, setPlatform] = useState("");
    const [games, setGames] = useState([]);
    const [editingId, setEditingId] = useState(null);

    async function carregarGames() {
        const lista = await getGame();
        setGames(lista);
    }

    async function salvar() {
        if (!title.trim() || !slug.trim() || !price.trim()) {
            alert("Preencha Título ou Slug ou Preço antes de salvar!");
            return;
        }
        const ok = await cadastra(title, slug, Number(price), platform);
        if (ok) {
            setTitle("");
            setSlug("");
            setPrice("");
            setPlatform("");
            await carregarGames();
        }
    }

    async function atualizar() {
        if (!editingId) return;
        const ok = await edita(editingId, title, slug, Number(price), platform);
        if (ok) {
            setTitle("");
            setSlug("");
            setPrice("");
            setPlatform("");
            setEditingId(null);
            await carregarGames();
        }
    }

    async function editarGames(game_id) {
        const game = await getGameById(game_id);
        if (!game) return;
        setTitle(game.title);
        setSlug(game.slug);
        setPrice(String(game.price));
        setPlatform(game.platform);
        setEditingId(game_id);
    }

    async function excluir(game_id) {
        const ok = await apaga(game_id);
        if (ok) await carregarGames();
    }

    useEffect(() => {
        carregarGames();
    }, []);

    return (
        <SafeAreaView style={estilos.container}>
            <TextInput
                placeholder="Título do jogo"
                value={title}
                onChangeText={setTitle}
                style={estilos.input}
            />
            <TextInput
                placeholder="Slug"
                value={slug}
                onChangeText={setSlug}
                style={estilos.input}
            />
            <TextInput
                placeholder="Plataforma"
                value={platform}
                onChangeText={setPlatform}
                style={estilos.input}
            />
            <TextInput
                placeholder="Preço"
                keyboardType="numeric"
                value={price}
                onChangeText={setPrice}
                style={estilos.input}
            />


            <View style={estilos.linhaEntrada}>
                <Button title="Salvar" onPress={salvar} disabled={!!editingId} />
                <Button title="Atualizar" onPress={atualizar} disabled={!editingId} />
            </View>
            <View style={{ height: 8 }} />

            <Button title="Recarregar lista" onPress={carregarGames} />

            <FlatList
                data={games}
                keyExtractor={(game) => String(game.id)}
                renderItem={({ item: game }) => (
                    <View style={estilos.game}>
                        <View style={estilos.Header}>
                            <Text style={estilos.Titulo}>{game.title}</Text>

                            <View style={estilos.acoesLinha}>
                                <Button title="E" onPress={() => editarGames(game.id)} />
                                <Button title="X" color="#e00b0b" onPress={() => excluir(game.id)} />
                            </View>
                        </View>

                        <Text>Slug: {game.slug}</Text>
                        <Text>Plataforma: {game.platform}</Text>
                        <Text>Preço: {String(game.price)}</Text>
                    </View>
                )}
            />
        </SafeAreaView>
    );
}

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#f5f7fa",
    },

    input: {
        backgroundColor: "#ffffff",
        color: "#1a1a1a",
        borderWidth: 1,
        borderColor: "#c7d0dd",
        borderRadius: 10,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 10,
        fontSize: 15,

        shadowColor: "#9ab6d6",
        shadowOpacity: 0.15,
        shadowRadius: 4,
    },

    linhaEntrada: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 12,
    },

    game: {
        backgroundColor: "#ffffff",
        borderRadius: 14,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: "#d4ddec",

        shadowColor: "#a7c3e7",
        shadowOpacity: 0.25,
        shadowRadius: 8,
    },

    Header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 8,
    },

    Titulo: {
        fontWeight: "bold",
        fontSize: 18,
        color: "#3b4b66",
        textShadowColor: "#dce7f6",
        textShadowRadius: 4,
    },

    acoesLinha: {
        flexDirection: "row",
        gap: 8,
    }
});